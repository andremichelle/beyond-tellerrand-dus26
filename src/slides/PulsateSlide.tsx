import css from "./PulsateSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Nullable} from "@opendaw/lib-std"
import {Slide} from "@/Slide"
import {Circle, PulsateSolver} from "./pulsate/solver"
import {PulsateRenderer} from "./pulsate/renderer"
import {PulsateSound} from "./pulsate/sound"

const className = Html.adoptStyleSheet(css, "Pulsate")

const IMPULSE_URL = "/pulsate/impulse-reverb.wav"
const BIRTH_VELOCITY = 80.0
const MAX_DT = 1.0 / 30.0

export const PulsateSlide = () => {
    const canvas = <canvas/> as HTMLCanvasElement
    const hint = <div class="hint">Click to add a circle. Space to clear.</div> as HTMLDivElement

    const onConnect = (host: HTMLElement) => {
        const solver = new PulsateSolver()
        const renderer = new PulsateRenderer(canvas)

        const audioContext = new AudioContext({latencyHint: 0})
        let sound: Nullable<PulsateSound> = null
        let terminated = false

        fetch(IMPULSE_URL)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer))
            .then(impulse => {
                if (terminated) {return}
                sound = new PulsateSound(audioContext, impulse)
            })
            .catch(() => {/* impulse failed to load — run silent */})

        let lastTime = performance.now()
        let hintVisible = true

        const onPointerDown = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const scaleX = canvas.clientWidth / rect.width
            const scaleY = canvas.clientHeight / rect.height
            const x = (event.clientX - rect.left) * scaleX
            const y = (event.clientY - rect.top) * scaleY
            solver.circles.push(new Circle(x, y, 0.0, BIRTH_VELOCITY))
            if (audioContext.state === "suspended") {
                audioContext.resume().catch(() => {/* ignore */})
            }
            if (hintVisible) {
                hintVisible = false
                hint.classList.add("faded")
            }
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                solver.clear()
                event.preventDefault()
            }
        }

        canvas.addEventListener("pointerdown", onPointerDown)
        window.addEventListener("keydown", onKeyDown)

        const terminate = () => {
            if (terminated) {return}
            terminated = true
            canvas.removeEventListener("pointerdown", onPointerDown)
            window.removeEventListener("keydown", onKeyDown)
            if (sound !== null) {sound.terminate()}
            audioContext.close().catch(() => {/* ignore */})
        }

        const frame = (now: number) => {
            if (!host.isConnected) {
                terminate()
                return
            }
            const dt = Math.min(MAX_DT, (now - lastTime) / 1000)
            lastTime = now
            if (dt > 0) {
                if (sound !== null) {
                    sound.advance(solver, dt)
                } else {
                    solver.run(dt, () => {/* silent */})
                }
            }
            renderer.render(solver.circles)
            requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
    }

    return (
        <Slide eyebrow="Pulsate" headline="An audio experiment.">
            <div class={className} onConnect={onConnect}>
                {canvas}
                {hint}
            </div>
        </Slide>
    )
}
