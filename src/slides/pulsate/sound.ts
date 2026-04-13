import {Collision, CollisionPair, PulsateSolver} from "./solver"

const radiusToNote = ((): (radius: number) => number => {
    const notes = [0, 2, 5, 7, 9]
    const minRadius = 1.0
    const maxRadius = 160.0
    return (radius: number): number => {
        const clamped = Math.max(minRadius, Math.min(maxRadius, radius))
        const norm = (clamped - minRadius) / (maxRadius - minRadius)
        const index = Math.floor(36.0 - 36.0 * norm)
        let octave = Math.floor(index / 5)
        if (octave < 4) {octave = 4}
        return octave * 12 + notes[index % 5]
    }
})()

const midiToHz = (note: number, base: number = 440): number => base * Math.pow(2.0, (note + 3) / 12 - 6)

export class PulsateSound {
    readonly context: AudioContext
    readonly #masterGain: GainNode
    readonly #graphNodes: Array<AudioNode> = []

    constructor(context: AudioContext, impulse: AudioBuffer) {
        this.context = context

        const masterGain = context.createGain()
        masterGain.gain.value = 0.3
        this.#masterGain = masterGain
        this.#graphNodes.push(masterGain)

        const convolver = context.createConvolver()
        convolver.buffer = impulse
        this.#graphNodes.push(convolver)

        const delay = context.createDelay()
        delay.delayTime.value = 0.5
        const feedbackGain = context.createGain()
        feedbackGain.gain.value = 0.7
        const wetGain = context.createGain()
        wetGain.gain.value = 0.4
        this.#graphNodes.push(delay, feedbackGain, wetGain)

        masterGain.connect(delay)
        delay.connect(feedbackGain)
        feedbackGain.connect(delay)
        feedbackGain.connect(wetGain)
        wetGain.connect(convolver)

        const compressor = context.createDynamicsCompressor()
        compressor.threshold.value = -6
        compressor.knee.value = 3
        compressor.ratio.value = 20
        compressor.attack.value = 0.001
        compressor.release.value = 0.1
        this.#graphNodes.push(compressor)

        masterGain.connect(compressor)
        convolver.connect(compressor)
        compressor.connect(context.destination)
    }

    advance(solver: PulsateSolver, dt: number): void {
        const context = this.context
        const masterGain = this.#masterGain
        const runStartTime = context.currentTime - dt
        let elapsed = 0
        solver.run(dt, (collision: Collision) => {
            const offset = elapsed + collision.time
            elapsed = offset
            if (!(collision instanceof CollisionPair)) {return}
            if (collision.circleA === null || collision.circleB === null) {return}
            const startTime = Math.max(context.currentTime, runStartTime + offset)
            const stopTime = startTime + 0.1
            const envelope = context.createGain()
            envelope.gain.value = 1.0
            envelope.gain.linearRampToValueAtTime(0.0, stopTime)
            const oscA = context.createOscillator()
            oscA.frequency.value = midiToHz(radiusToNote(collision.circleA.radius))
            oscA.connect(envelope).connect(masterGain)
            oscA.start(startTime)
            oscA.stop(stopTime)
            const oscB = context.createOscillator()
            oscB.frequency.value = midiToHz(radiusToNote(collision.circleB.radius))
            oscB.connect(envelope).connect(masterGain)
            oscB.start(startTime)
            oscB.stop(stopTime)
        })
    }

    terminate(): void {
        for (const node of this.#graphNodes) {
            try {node.disconnect()} catch {/* ignore */}
        }
        this.#graphNodes.length = 0
    }
}
