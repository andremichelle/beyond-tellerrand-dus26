import {Arrays, InaccessibleProperty, int, Nullable, Progress, UUID} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"
import {MaximizerDeviceBox, NoteEventBox, NoteRegionBox} from "@opendaw/studio-boxes"
import {InstrumentFactories, SoundfontMetaData} from "@opendaw/studio-adapters"
import {
    AudioWorklets,
    EffectFactories,
    GlobalSampleLoaderManager,
    GlobalSoundfontLoaderManager,
    Project,
    ProjectEnv,
    SampleService,
    SoundfontProvider,
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
    readonly steps: int
    readonly rows: int

    terminate(): void
}

export const createDrumComputerEngine = async (): Promise<DrumComputerEngine> => {
    await ensureWorkersInstalled()
    const audioContext = new AudioContext({latencyHint: 0})
    const audioWorklets = await AudioWorklets.createFor(audioContext)
    const sampleManager = new GlobalSampleLoaderManager(new LocalSampleProvider())
    const soundfontManager = new GlobalSoundfontLoaderManager(stubSoundfontProvider)
    const sampleService = new SampleService(audioContext)
    const env: ProjectEnv = {
        audioContext,
        audioWorklets,
        sampleManager,
        soundfontManager,
        sampleService,
        soundfontService: InaccessibleProperty("soundfontService")
    }
    const project = Project.new(env)
    const {api} = project
    const attachment: PlayfieldAttachment = TR909_SAMPLES.map((sample, index) => ({
        note: BASE_PITCH + index,
        uuid: sample.uuid,
        name: sample.name,
        durationInSeconds: sample.durationInSeconds,
        exclude: index === 4 || index === 5
    }))
    const rows = TR909_SAMPLES.length
    const eventBoxes: Array<Array<Nullable<NoteEventBox>>> = Arrays.create(() => Arrays.create(() => null, STEPS), rows)
    const region = project.editing.modify(() => {
        api.setBpm(126)
        const {trackBox} = api.createInstrument(InstrumentFactories.Playfield, {name: "TR-909", attachment})
        const box = api.insertEffect(project.primaryAudioUnitBox.audioEffects, EffectFactories.Maximizer) as MaximizerDeviceBox
        box.threshold.setValue(-6.0)
        box.index.setValue(0)
        box.enabled.setValue(true)
        const {loopArea} = project.timelineBox
        loopArea.enabled.setValue(true)
        loopArea.from.setValue(0)
        loopArea.to.setValue(LOOP_DURATION)
        return api.createNoteRegion({
            trackBox,
            position: 0,
            duration: LOOP_DURATION,
            loopDuration: LOOP_DURATION,
            name: "TR-909 Loop"
        })
    }).unwrap("Failed to create TR-909 audio unit")
    project.startAudioWorklet()
    project.engine.play()
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
    const {project: {editing, api}, region} = engine
    engine.eventBoxes[row][step] = editing.modify(() => api.createNoteEvent({
        owner: region,
        position: step * STEP_PPQN,
        duration: STEP_PPQN,
        pitch: BASE_PITCH + row,
        velocity: 1.0
    })).unwrap("Failed to create note event")
    return true
}

export const clearPattern = (engine: DrumComputerEngine): void => {
    engine.project.editing.modify(() => {
        for (const row of engine.eventBoxes) {
            for (let step = 0; step < row.length; step++) {
                const existing = row[step]
                if (existing !== null) {
                    existing.delete()
                    row[step] = null
                }
            }
        }
    })
}