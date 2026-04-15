import {
    Arrays,
    asInstanceOf,
    InaccessibleProperty,
    int,
    isNotNull,
    Nullable,
    Progress,
    UUID,
    ValueMapping
} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"
import {
    ApparatDeviceBox,
    DattorroReverbDeviceBox,
    DelayDeviceBox,
    MaximizerDeviceBox,
    NoteEventBox,
    NoteRegionBox,
    SpielwerkDeviceBox,
    WerkstattParameterBox
} from "@opendaw/studio-boxes"
import {InstrumentFactories, ScriptCompiler, SoundfontMetaData} from "@opendaw/studio-adapters"
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
import {FieldKnobParameter, KnobParameter, WerkstattKnobParameter} from "./knob-parameter"
import {ParamDeclaration, parseParamDeclarations} from "./param-declarations"

const fetchText = async (url: string): Promise<string> => {
    const response = await fetch(url)
    if (!response.ok) {throw new Error(`Failed to fetch ${url}: ${response.status}`)}
    return response.text()
}

const APPARAT_303_URL = "/scripts/apparat-303.js"
const SPIELWERK_303_URL = "/scripts/spielwerk-303.js"

const apparatCompiler = ScriptCompiler.create({
    headerTag: "apparat",
    registryName: "apparatProcessors",
    functionName: "apparat"
})
const spielwerkCompiler = ScriptCompiler.create({
    headerTag: "spielwerk",
    registryName: "spielwerkProcessors",
    functionName: "spielwerk"
})

const buildKnobParameters = (
    project: Project,
    deviceBox: ApparatDeviceBox | SpielwerkDeviceBox,
    declarations: ReadonlyArray<ParamDeclaration>
): ReadonlyArray<KnobParameter> => {
    const byLabel = new Map<string, WerkstattParameterBox>()
    for (const pointer of deviceBox.parameters.pointerHub.filter()) {
        const box = asInstanceOf(pointer.box, WerkstattParameterBox)
        byLabel.set(box.label.getValue(), box)
    }
    const result: Array<KnobParameter> = []
    for (const decl of declarations) {
        const box = byLabel.get(decl.label)
        if (box === undefined) {continue}
        result.push(new WerkstattKnobParameter(project, box, decl))
    }
    return result
}

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
    readonly apparatParameters: ReadonlyArray<KnobParameter>
    readonly spielwerkParameters: ReadonlyArray<KnobParameter>
    readonly fxParameters: ReadonlyArray<KnobParameter>

    terminate(): void
}

const SILENT_DB = -72.0

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
        soundfontService: InaccessibleProperty("soundfontService not used")
    }
    const [apparatSource, spielwerkSource] = await Promise.all([
        fetchText(APPARAT_303_URL),
        fetchText(SPIELWERK_303_URL)
    ])
    const apparatDeclarations = parseParamDeclarations(apparatSource)
    const spielwerkDeclarations = parseParamDeclarations(spielwerkSource)
    const project = Project.new(env)
    const {api, editing, engine, primaryAudioUnitBox, timelineBox: {loopArea}} = project
    const attachment: PlayfieldAttachment = TR909_SAMPLES.map((sample, index) => ({
        note: BASE_PITCH + index,
        uuid: sample.uuid,
        name: sample.name,
        durationInSeconds: sample.durationInSeconds,
        exclude: index === 4 || index === 5
    }))
    const rows = TR909_SAMPLES.length
    const eventBoxes: Array<Array<Nullable<NoteEventBox>>> = Arrays.create(() => Arrays.create(() => null, STEPS), rows)
    const created = editing.modify(() => {
        api.setBpm(126)
        const {trackBox} = api.createInstrument(InstrumentFactories.Playfield, {name: "TR-909", attachment})
        const maximizer = api.insertEffect(primaryAudioUnitBox.audioEffects, EffectFactories.Maximizer) as MaximizerDeviceBox
        maximizer.threshold.setValue(-1.5)
        maximizer.index.setValue(0)
        maximizer.enabled.setValue(true)
        loopArea.enabled.setValue(true)
        loopArea.from.setValue(0)
        loopArea.to.setValue(LOOP_DURATION)
        const region = api.createNoteRegion({
            trackBox,
            position: 0,
            duration: LOOP_DURATION,
            loopDuration: LOOP_DURATION,
            name: "TR-909 Loop"
        })
        const {
            audioUnitBox: bassUnit,
            instrumentBox: apparatBox,
            trackBox: bassTrack
        } = api.createInstrument(InstrumentFactories.Apparat, {name: "TB-303"})
        const spielwerkBox = api.insertEffect(
            bassUnit.midiEffects,
            EffectFactories.Spielwerk
        ) as SpielwerkDeviceBox
        const delayBox = api.insertEffect(
            bassUnit.audioEffects,
            EffectFactories.Delay
        ) as DelayDeviceBox
        delayBox.wet.setValue(SILENT_DB)
        const reverbBox = api.insertEffect(
            bassUnit.audioEffects,
            EffectFactories.DattorroReverb
        ) as DattorroReverbDeviceBox
        reverbBox.wet.setValue(SILENT_DB)
        const bassRegion = api.createNoteRegion({
            trackBox: bassTrack,
            position: 0,
            duration: LOOP_DURATION,
            loopDuration: LOOP_DURATION,
            name: "TB-303 Loop"
        })
        api.createNoteEvent({
            owner: bassRegion,
            position: 0,
            duration: LOOP_DURATION,
            pitch: 36,
            velocity: 1.0
        })
        return {region, apparatBox, spielwerkBox, delayBox, reverbBox}
    }).unwrap("Failed to create TR-909 audio unit")
    await apparatCompiler.compile(audioContext, editing, created.apparatBox, apparatSource)
    await spielwerkCompiler.compile(audioContext, editing, created.spielwerkBox, spielwerkSource)
    const apparatParameters = buildKnobParameters(project, created.apparatBox, apparatDeclarations)
    const spielwerkParameters = buildKnobParameters(project, created.spielwerkBox, spielwerkDeclarations)
    const fxParameters: ReadonlyArray<KnobParameter> = [
        new FieldKnobParameter(project, created.delayBox.wet, {
            label: "delay",
            unit: "db",
            mapping: ValueMapping.DefaultDecibel,
            fractionDigits: 1
        }),
        new FieldKnobParameter(project, created.reverbBox.wet, {
            label: "reverb",
            unit: "db",
            mapping: ValueMapping.DefaultDecibel,
            fractionDigits: 1
        })
    ]
    project.startAudioWorklet()
    const terminate = (): void => {
        engine.stop(true)
        apparatParameters.forEach(p => p.terminate())
        spielwerkParameters.forEach(p => p.terminate())
        fxParameters.forEach(p => p.terminate())
        project.terminate()
        audioContext.close().catch(() => {/* ignore */})
    }
    return {
        project,
        audioContext,
        region: created.region,
        eventBoxes,
        steps: STEPS,
        rows,
        apparatParameters,
        spielwerkParameters,
        fxParameters,
        terminate
    }
}

export const toggleStep = (engine: DrumComputerEngine, row: number, step: number): boolean => {
    const {eventBoxes, project: {editing, api}, region} = engine
    const existing = eventBoxes[row][step]
    if (isNotNull(existing)) {
        editing.modify(() => existing.delete())
        eventBoxes[row][step] = null
        return false
    }
    eventBoxes[row][step] = editing.modify(() => api.createNoteEvent({
        owner: region,
        position: step * STEP_PPQN,
        duration: STEP_PPQN,
        pitch: BASE_PITCH + row,
        velocity: 1.0
    })).unwrap("Failed to create note event")
    return true
}

export const clearPattern = ({project: {editing}, eventBoxes}: DrumComputerEngine) => editing.modify(() => {
    for (const row of eventBoxes) {
        for (let step = 0; step < row.length; step++) {
            const existing = row[step]
            if (isNotNull(existing)) {
                existing.delete()
                row[step] = null
            }
        }
    }
})