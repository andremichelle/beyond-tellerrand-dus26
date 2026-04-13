import {Nullable, Progress, UUID} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"
import {NoteEventBox, NoteRegionBox} from "@opendaw/studio-boxes"
import {InstrumentFactories, SoundfontMetaData} from "@opendaw/studio-adapters"
import {
    AudioWorklets,
    GlobalSampleLoaderManager,
    GlobalSoundfontLoaderManager,
    Project,
    ProjectEnv,
    SampleService,
    SoundfontProvider,
    SoundfontService,
    Workers
} from "@opendaw/studio-core"
import workletsUrl from "@opendaw/studio-core/processors.js?url"
import workersUrl from "@opendaw/studio-core/workers-main.js?worker&url"
import {LocalSampleProvider} from "./sample-provider"
import {BASE_PITCH, TR909_SAMPLES} from "./samples"

type PlayfieldAttachment = InstrumentFactories.PlayfieldAttachment

const BARS = 1
const STEPS = 16
const STEP_PPQN = PPQN.SemiQuaver
const LOOP_DURATION = PPQN.Bar * BARS

const stubSoundfontProvider: SoundfontProvider = {
    fetch: (_uuid: UUID.Bytes, _progress: Progress.Handler): Promise<[ArrayBuffer, SoundfontMetaData]> =>
        Promise.reject(new Error("Soundfont provider is not available in this slide"))
}

let workersInstalled: Nullable<Promise<void>> = null

const ensureWorkersInstalled = (): Promise<void> => {
    if (workersInstalled === null) {
        workersInstalled = Workers.install(workersUrl).then(() => {
            AudioWorklets.install(workletsUrl)
        })
    }
    return workersInstalled
}

export type DrumComputerEngine = {
    readonly project: Project
    readonly audioContext: AudioContext
    readonly region: NoteRegionBox
    readonly eventBoxes: Array<Array<Nullable<NoteEventBox>>>
    readonly steps: number
    readonly rows: number
    terminate(): void
}

export const createDrumComputerEngine = async (): Promise<DrumComputerEngine> => {
    console.log("[drum-computer] ensureWorkersInstalled")
    await ensureWorkersInstalled()
    console.log("[drum-computer] new AudioContext")
    const audioContext = new AudioContext({latencyHint: 0})
    console.debug(`[drum-computer] AudioContext state: ${audioContext.state}`)
    if (!crossOriginIsolated) {
        console.warn("[drum-computer] Page is NOT cross-origin isolated — SharedArrayBuffer will be unavailable. " +
            "Restart the Vite dev server to pick up the new COOP/COEP headers.")
    }
    console.log("[drum-computer] AudioWorklets.createFor")
    const audioWorklets = await AudioWorklets.createFor(audioContext)
    console.log("[drum-computer] sample / soundfont managers")
    const sampleManager = new GlobalSampleLoaderManager(new LocalSampleProvider())
    const soundfontManager = new GlobalSoundfontLoaderManager(stubSoundfontProvider)
    const sampleService = new SampleService(audioContext)
    const soundfontService = Object.create(SoundfontService.prototype) as SoundfontService
    const env: ProjectEnv = {
        audioContext,
        audioWorklets,
        sampleManager,
        soundfontManager,
        sampleService,
        soundfontService
    }
    console.log("[drum-computer] Project.new")
    const project = Project.new(env)
    project.api.setBpm(120)

    const attachment: PlayfieldAttachment = TR909_SAMPLES.map((sample, index) => ({
        note: BASE_PITCH + index,
        uuid: sample.uuid,
        name: sample.name,
        durationInSeconds: sample.durationInSeconds,
        exclude: false
    }))

    const rows = TR909_SAMPLES.length
    const eventBoxes: Array<Array<Nullable<NoteEventBox>>> = Array.from(
        {length: rows},
        () => new Array<Nullable<NoteEventBox>>(STEPS).fill(null)
    )

    console.log("[drum-computer] editing.modify → Playfield + NoteRegion")
    const region = project.editing.modify(() => {
        const {trackBox} = project.api.createInstrument(
            InstrumentFactories.Playfield,
            {name: "TR-909", attachment}
        )
        const {loopArea} = project.timelineBox
        loopArea.enabled.setValue(true)
        loopArea.from.setValue(0)
        loopArea.to.setValue(LOOP_DURATION)
        return project.api.createNoteRegion({
            trackBox,
            position: 0,
            duration: LOOP_DURATION,
            loopDuration: LOOP_DURATION,
            name: "TR-909 Loop"
        })
    }).unwrap("Failed to create TR-909 audio unit")

    console.log("[drum-computer] project.startAudioWorklet")
    project.startAudioWorklet()
    console.log("[drum-computer] project.engine.play")
    project.engine.play()
    console.log("[drum-computer] ready")

    const terminate = (): void => {
        project.engine.stop(true)
        project.terminate()
        audioContext.close().catch(() => {/* ignore */})
    }

    return {
        project,
        audioContext,
        region,
        eventBoxes,
        steps: STEPS,
        rows,
        terminate
    }
}

export const toggleStep = (engine: DrumComputerEngine, row: number, step: number): boolean => {
    const existing = engine.eventBoxes[row][step]
    if (existing !== null) {
        engine.project.editing.modify(() => {
            existing.delete()
        })
        engine.eventBoxes[row][step] = null
        return false
    }
    engine.eventBoxes[row][step] = engine.project.editing.modify(() => engine.project.api.createNoteEvent({
        owner: engine.region,
        position: step * STEP_PPQN,
        duration: STEP_PPQN,
        pitch: BASE_PITCH + row,
        velocity: 1.0
    })).unwrap("Failed to create note event")
    return true
}
