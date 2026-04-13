import {Nullable} from "@opendaw/lib-std"
import {Model} from "./model"

const midiToFrequency = (note: number): number => 440.0 * Math.pow(2.0, (note + 3.0) / 12.0 - 6.0)

const NOTES = new Float32Array([
    midiToFrequency(96), midiToFrequency(93), midiToFrequency(91), midiToFrequency(89),
    midiToFrequency(86), midiToFrequency(84), midiToFrequency(81), midiToFrequency(79),
    midiToFrequency(77), midiToFrequency(74), midiToFrequency(72), midiToFrequency(69),
    midiToFrequency(67), midiToFrequency(65), midiToFrequency(62), midiToFrequency(60)
])

const LOOK_AHEAD_TIME = 0.010
const SCHEDULE_TIME = 0.010
const ADDITIONAL_LATENCY = 0.005
const SEMIQUAVER = 1.0 / 16.0
const RELEASE_TIME = 0.250
const VOICE_GAIN = 0.75
const BPM = 120.0

export class ToneMatrixAudio {
    readonly context: AudioContext
    readonly #model: Model
    readonly #voiceMix: GainNode
    readonly #fxNodes: Array<AudioNode> = []

    #nextScheduleTime: number = 0.0
    #absoluteTime: number = 0.0
    #intervalId: Nullable<ReturnType<typeof setInterval>> = null

    constructor(context: AudioContext, model: Model) {
        this.context = context
        this.#model = model
        this.#voiceMix = context.createGain()
        this.#voiceMix.gain.value = 0.5
        this.#fxNodes.push(this.#voiceMix)
        this.#buildFxChain()
    }

    start(): void {
        if (this.#intervalId !== null) {return}
        this.#absoluteTime = 0.0
        this.#nextScheduleTime = this.context.currentTime + LOOK_AHEAD_TIME
        this.#intervalId = setInterval(() => {
            const now = this.context.currentTime
            if (now + LOOK_AHEAD_TIME >= this.#nextScheduleTime) {
                const m0 = this.#absoluteTime
                const m1 = m0 + SCHEDULE_TIME
                const t0 = this.#secondsToBars(m0)
                const t1 = this.#secondsToBars(m1)
                this.#schedule(t0, t1)
                this.#absoluteTime += SCHEDULE_TIME
                this.#nextScheduleTime += SCHEDULE_TIME
            }
        }, 1)
    }

    terminate(): void {
        if (this.#intervalId !== null) {
            clearInterval(this.#intervalId)
            this.#intervalId = null
        }
        for (const node of this.#fxNodes) {
            try {node.disconnect()} catch {/* ignore */}
        }
        this.#fxNodes.length = 0
        if (this.context.state !== "closed") {
            this.context.close().catch(() => {/* ignore */})
        }
    }

    #schedule(t0: number, t1: number): void {
        let index = (t0 / SEMIQUAVER) | 0
        if (index < 0) {return}
        let barPosition = index * SEMIQUAVER
        while (barPosition < t1) {
            if (barPosition >= t0) {
                const time = this.#computeStartOffset(barPosition)
                const x = index & 15
                for (let y = 0; y < 16; y++) {
                    if (this.#model.pattern.getStep(x, y)) {
                        this.#playVoice(time, y)
                    }
                }
            }
            barPosition = ++index * SEMIQUAVER
        }
        const bars = this.#secondsToBars(this.#absoluteTime + SCHEDULE_TIME)
        this.#model.stepIndex = (Math.floor(bars / SEMIQUAVER) - 1) & 15
    }

    #computeStartOffset(barPosition: number): number {
        return (this.#nextScheduleTime - this.#absoluteTime) + this.#barsToSeconds(barPosition) + ADDITIONAL_LATENCY
    }

    #barsToSeconds(bars: number): number {return bars * 240.0 / BPM}

    #secondsToBars(seconds: number): number {return seconds * BPM / 240.0}

    #playVoice(time: number, rowIndex: number): void {
        const context = this.context
        const endTime = time + RELEASE_TIME
        const oscillator = context.createOscillator()
        const envelope = context.createGain()
        const panner = context.createStereoPanner()
        panner.pan.value = Math.random() - Math.random()
        envelope.gain.value = VOICE_GAIN
        envelope.gain.setValueAtTime(VOICE_GAIN, time)
        envelope.gain.linearRampToValueAtTime(0.0, endTime)
        oscillator.frequency.value = NOTES[rowIndex]
        oscillator.connect(panner)
        panner.connect(envelope)
        envelope.connect(this.#voiceMix)
        oscillator.start(time)
        oscillator.stop(endTime)
    }

    #buildFxChain(): void {
        const context = this.context
        const delay = context.createDelay()
        delay.delayTime.value = this.#barsToSeconds(3.0 / 16.0)
        const feedbackGain = context.createGain()
        feedbackGain.gain.value = 0.4
        const wetGain = context.createGain()
        wetGain.gain.value = 0.1
        this.#fxNodes.push(delay, feedbackGain, wetGain)
        this.#voiceMix.connect(delay)
        delay.connect(feedbackGain)
        feedbackGain.connect(delay)
        feedbackGain.connect(wetGain)
        wetGain.connect(context.destination)
        this.#voiceMix.connect(context.destination)
    }
}
