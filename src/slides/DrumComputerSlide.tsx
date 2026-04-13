import css from "./DrumComputerSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Nullable} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"
import {Slide} from "@/Slide"
import {createDrumComputerEngine, DrumComputerEngine, toggleStep} from "./drum-computer/engine-setup"
import {TR909_SAMPLES} from "./drum-computer/samples"

const className = Html.adoptStyleSheet(css, "DrumComputer")

const STEPS = 16
const STEP_PPQN = PPQN.SemiQuaver
const LOOP_PPQN = PPQN.Bar

export const DrumComputerSlide = () => {
    const status = <span>Loading TR-909 kit…</span> as HTMLSpanElement
    const grid = <div class="grid"/> as HTMLDivElement

    const onConnect = (host: HTMLElement) => {
        let engine: Nullable<DrumComputerEngine> = null
        let terminated = false
        const cells: Array<Array<HTMLButtonElement>> = []

        const buildGrid = (built: DrumComputerEngine): void => {
            grid.innerHTML = ""
            for (let row = 0; row < built.rows; row++) {
                const rowCells: Array<HTMLButtonElement> = []
                const label = <div class="label">{TR909_SAMPLES[row].shortLabel}</div>
                grid.appendChild(label)
                for (let step = 0; step < STEPS; step++) {
                    const classes = ["step"]
                    if (step % 4 === 0) {classes.push("beat")}
                    const cell: HTMLButtonElement = (
                        <button
                            type="button"
                            class={classes.join(" ")}
                            onclick={() => {
                                if (engine === null || terminated) {return}
                                const on = toggleStep(engine, row, step)
                                cell.classList.toggle("on", on)
                            }}/>
                    )
                    grid.appendChild(cell)
                    rowCells.push(cell)
                }
                cells.push(rowCells)
            }
        }

        const watchPlayhead = () => {
            if (terminated || !host.isConnected || engine === null) {
                if (!host.isConnected) {cleanup()}
                return
            }
            const pulses = engine.project.engine.position.getValue()
            const position = ((pulses % LOOP_PPQN) + LOOP_PPQN) % LOOP_PPQN
            const currentStep = Math.floor(position / STEP_PPQN) % STEPS
            for (let row = 0; row < cells.length; row++) {
                const rowCells = cells[row]
                for (let step = 0; step < rowCells.length; step++) {
                    rowCells[step].classList.toggle("playing", step === currentStep)
                }
            }
            requestAnimationFrame(watchPlayhead)
        }

        const cleanup = (): void => {
            if (terminated) {return}
            terminated = true
            if (engine !== null) {engine.terminate()}
        }

        const stallWarning = window.setTimeout(() => {
            console.warn("[drum-computer] Engine bootstrap is taking longer than 3s — something is stuck.")
            status.textContent = "Still loading TR-909 kit… (check console)"
        }, 3000)

        createDrumComputerEngine().then((built) => {
            window.clearTimeout(stallWarning)
            if (terminated) {
                built.terminate()
                return
            }
            engine = built
            buildGrid(built)
            if (built.audioContext.state === "suspended") {
                console.warn("[drum-computer] AudioContext is suspended — waiting for a user gesture.")
                status.textContent = "Click anywhere to start audio"
                const resume = () => {
                    host.removeEventListener("click", resume)
                    built.audioContext.resume().then(() => {
                        status.textContent = "TR-909 · 120 BPM · Click steps to play"
                    }).catch((error: unknown) => {
                        console.error("[drum-computer] resume failed", error)
                    })
                }
                host.addEventListener("click", resume, {once: true})
            } else {
                status.textContent = "TR-909 · 120 BPM · Click steps to play"
            }
            requestAnimationFrame(watchPlayhead)
        }).catch((error: unknown) => {
            window.clearTimeout(stallWarning)
            console.error("[drum-computer] bootstrap failed", error)
            status.textContent = `Failed to start: ${error instanceof Error ? error.message : String(error)}`
        })

        const hostWatcher = () => {
            if (terminated) {return}
            if (!host.isConnected) {
                cleanup()
                return
            }
            requestAnimationFrame(hostWatcher)
        }
        requestAnimationFrame(hostWatcher)
    }

    return (
        <Slide eyebrow="openDAW SDK" headline="A drum computer.">
            <div class={className} onConnect={onConnect}>
                <div class="status">{status}</div>
                {grid}
            </div>
        </Slide>
    )
}
