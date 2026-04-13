import css from "./FlashAudioHackSlide.sass?inline"
import {createElement, Frag} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "FlashAudioHack")

type StepProps = {
    x: number
    y: number
    w: number
    h: number
    title: string
    sub: string
    variant?: "accent" | "terminal"
}

const Step = ({x, y, w, h, title, sub, variant}: StepProps) => {
    const cx = x + w / 2
    const cy = y + h / 2
    const boxClass = `box${variant ? ` ${variant}` : ""}`
    return (
        <Frag>
            <rect x={x} y={y} width={w} height={h} rx={12} ry={12} class={boxClass}/>
            <text x={String(cx)} y={String(cy - 6)} class="box-label" text-anchor="middle">{title}</text>
            <text x={String(cx)} y={String(cy + 28)} class="box-sub" text-anchor="middle">{sub}</text>
        </Frag>
    )
}

const Arrow = ({x1, y1, x2, y2}: { x1: number, y1: number, x2: number, y2: number }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} class="arrow" marker-end="url(#arrow-head)"/>
)

export const FlashAudioHackSlide = () => {
    const w = 280
    const h = 130
    const y = 140
    const gap = 60
    const xs = [40, 40 + (w + gap), 40 + 2 * (w + gap), 40 + 3 * (w + gap), 40 + 4 * (w + gap)]
    const arrowGap = 12
    return (
        <Slide eyebrow="Flash 9 · 2005" headline="The Audio Hack that started Web DSP.">
            <div className={className}>
                <p className="note">
                    The first time arbitrary client-computed audio could play in the browser.
                </p>
                <ul className="bullets">
                    <li>Real-time software synthesis in the browser</li>
                    <li>Trackers, drum machines, samplers</li>
                    <li>Effects like eq, delay, reverb</li>
                    <li>Generative and algorithmic music</li>
                </ul>
                <svg class="diagram" viewBox="0 0 1720 560" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <marker id="arrow-head" viewBox="0 0 10 10" refX="9" refY="5"
                                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-gray)"/>
                        </marker>
                        <marker id="loop-head" viewBox="0 0 10 10" refX="9" refY="5"
                                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-orange)"/>
                        </marker>
                    </defs>
                    <Step x={xs[0]} y={y} w={w} h={h} title="DSP" sub="generate samples"/>
                    <Step x={xs[1]} y={y} w={w} h={h} title="ByteArray" sub="raw 16-bit PCM"/>
                    <Step x={xs[2]} y={y} w={w} h={h} title="In-memory SWF" sub="wrap as Sound tag" variant="accent"/>
                    <Step x={xs[3]} y={y} w={w} h={h} title="Loader" sub="loadBytes()"/>
                    <Step x={xs[4]} y={y} w={w} h={h} title="SoundChannel" sub="play() →" variant="terminal"/>
                    {xs.slice(0, -1).map((x, index) => (
                        <Arrow
                            x1={x + w + arrowGap}
                            y1={y + h / 2}
                            x2={xs[index + 1] - arrowGap}
                            y2={y + h / 2}
                        />
                    ))}
                    <path
                        class="loop"
                        d={`M ${xs[4] + w / 2} ${y + h + 10} V 430 H ${xs[0] + w / 2} V ${y + h + 10}`}
                        marker-end="url(#loop-head)"
                    />
                    <text x={String((xs[0] + xs[4] + w) / 2)} y="460" text-anchor="middle" class="loop-label">
                        Event.SOUND_COMPLETE → next chunk
                    </text>
                </svg>
            </div>
        </Slide>
    )
}
