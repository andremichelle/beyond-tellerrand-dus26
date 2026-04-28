import css from "./DigitalAudioSlide.sass?inline"
import {createElement, Frag} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "DigitalAudio")

const WIDTH = 1400
const HEIGHT = 460
const MARGIN_X = 60
const BASELINE = 180
const AMPLITUDE = 130
const CYCLES = 2
const SAMPLES = 24
const VALUE_ROW_Y = 400
const USABLE_WIDTH = WIDTH - 2 * MARGIN_X

const waveY = (x: number): number => {
    const t = (x - MARGIN_X) / USABLE_WIDTH
    return BASELINE - AMPLITUDE * Math.sin(2 * Math.PI * CYCLES * t)
}

const buildWavePath = (): string => {
    const steps = 240
    let d = ""
    for (let i = 0; i <= steps; i++) {
        const x = MARGIN_X + (i / steps) * USABLE_WIDTH
        const y = waveY(x)
        d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `
    }
    return d.trim()
}

type Sample = { x: number, y: number, value: number }

const buildSamples = (): ReadonlyArray<Sample> => {
    const result: Array<Sample> = []
    for (let i = 0; i < SAMPLES; i++) {
        const x = MARGIN_X + ((i + 0.5) / SAMPLES) * USABLE_WIDTH
        const t = (x - MARGIN_X) / USABLE_WIDTH
        const sinVal = Math.sin(2 * Math.PI * CYCLES * t)
        result.push({x, y: BASELINE - AMPLITUDE * sinVal, value: Math.round(sinVal * 127)})
    }
    return result
}

const WAVE_PATH = buildWavePath()
const SAMPLE_POINTS = buildSamples()

export const DigitalAudioSlide = () => (
    <Slide eyebrow="Digital Audio" headline="From moving air particles to numbers.">
        <div className={className}>
            <ul className="bullets">
                <li>Sound is pressure moving through air. A wave.</li>
                <li>A computer stores a list of numbers.</li>
            </ul>
            <svg class="diagram" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet">
                <text x={String(MARGIN_X)} y="40" class="axis-label">amplitude</text>
                <text x={String(WIDTH - MARGIN_X)} y={String(HEIGHT - 10)} text-anchor="end" class="axis-label">time</text>
                <line x1={String(MARGIN_X)} y1={String(BASELINE)} x2={String(WIDTH - MARGIN_X)} y2={String(BASELINE)} class="axis"/>
                <path d={WAVE_PATH} class="wave"/>
                {SAMPLE_POINTS.map((s) => (
                    <Frag>
                        <line x1={String(s.x)} y1={String(BASELINE)} x2={String(s.x)} y2={String(s.y)} class="stem"/>
                        <circle cx={String(s.x)} cy={String(s.y)} r="7" class="dot"/>
                        <text x={String(s.x)} y={String(VALUE_ROW_Y)} text-anchor="middle" class="value">{String(s.value)}</text>
                    </Frag>
                ))}
            </svg>
        </div>
    </Slide>
)
