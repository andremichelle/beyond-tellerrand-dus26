import {asDefined, panic, Progress, UUID} from "@opendaw/lib-std"
import {AudioData, WavFile} from "@opendaw/lib-dsp"
import {SampleMetaData} from "@opendaw/studio-adapters"
import {SampleProvider} from "@opendaw/studio-core"
import {DrumSample, SAMPLE_URL, TR909_SAMPLES} from "./samples"

const SAMPLE_INDEX: Map<string, DrumSample> = new Map(TR909_SAMPLES.map(sample => [sample.uuidString, sample]))

export class LocalSampleProvider implements SampleProvider {
    async fetch(uuid: UUID.Bytes, _progress: Progress.Handler): Promise<[AudioData, SampleMetaData]> {
        const uuidString = UUID.toString(uuid)
        const sample = asDefined(SAMPLE_INDEX.get(uuidString), `Unknown sample uuid: ${uuidString}`)
        const response = await fetch(SAMPLE_URL(uuidString))
        if (!response.ok) {return panic(`Failed to load ${sample.name}: ${response.status} ${response.statusText}`)}
        const arrayBuffer = await response.arrayBuffer()
        const audioData = WavFile.decodeFloats(arrayBuffer)
        const meta: SampleMetaData = {
            name: sample.name,
            bpm: 0,
            duration: audioData.numberOfFrames / audioData.sampleRate,
            sample_rate: audioData.sampleRate,
            origin: "openDAW"
        }
        return [audioData, meta]
    }
}