import css from "./ToneMatrixSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Nullable} from "@opendaw/lib-std"
import {Slide} from "@/Slide"
import {Model} from "./tonematrix/model"
import {View} from "./tonematrix/view"
import {ToneMatrixAudio} from "./tonematrix/audio"

const className = Html.adoptStyleSheet(css, "ToneMatrix")

export const ToneMatrixSlide = () => {
    const canvas = <canvas/> as HTMLCanvasElement
    const hint = <div class="hint">Click cells. Space to clear.</div> as HTMLDivElement

    const onConnect = (host: HTMLElement) => {
        const model = new Model()
        const view = new View(model, canvas)
        const audioContext = new AudioContext({latencyHint: 0})
        const audio = new ToneMatrixAudio(audioContext, model)
        let terminated = false
        let hintVisible = true

        const tryStart = () => {
            if (audioContext.state === "suspended") {
                audioContext.resume().then(() => {
                    if (!terminated) {audio.start()}
                }).catch(() => {/* ignore */})
            } else {
                audio.start()
            }
        }

        const onFirstInteraction = () => {
            if (hintVisible) {
                hintVisible = false
                hint.classList.add("faded")
            }
            tryStart()
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                model.pattern.clear()
                event.preventDefault()
            }
        }

        canvas.addEventListener("pointerdown", onFirstInteraction)
        window.addEventListener("keydown", onKeyDown)

        tryStart()

        const terminate: Nullable<() => void> = () => {
            if (terminated) {return}
            terminated = true
            canvas.removeEventListener("pointerdown", onFirstInteraction)
            window.removeEventListener("keydown", onKeyDown)
            audio.terminate()
            view.terminate()
        }

        const watcher = () => {
            if (!host.isConnected) {
                if (terminate !== null) {terminate()}
                return
            }
            requestAnimationFrame(watcher)
        }
        requestAnimationFrame(watcher)
    }

    return (
        <Slide eyebrow="ToneMatrix" headline="A pentatonic toy.">
            <div class={className} onConnect={onConnect}>
                {canvas}
                {hint}
            </div>
        </Slide>
    )
}
