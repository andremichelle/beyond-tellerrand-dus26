import css from "./DrumComputerSlide.sass?inline"
import {Terminator} from "@opendaw/lib-std"
import {Await, createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Promises} from "@opendaw/lib-runtime"
import {PPQN} from "@opendaw/lib-dsp"
import {Slide} from "@/Slide"
import {clearPattern, createDrumComputerEngine, DrumComputerEngine, toggleStep} from "./drum-computer/engine-setup"
import {TR909_SAMPLES} from "./drum-computer/samples"

const className = Html.adoptStyleSheet(css, "DrumComputer")

const STEPS = 16
const STEP_PPQN = PPQN.SemiQuaver
const LOOP_PPQN = PPQN.Bar

const DrumGrid = ({engine, terminator}: {engine: DrumComputerEngine, terminator: Terminator}) => {
    const grid: HTMLDivElement = <div class="grid"/>
    const cells: Array<Array<HTMLButtonElement>> = []
    for (let row = 0; row < engine.rows; row++) {
        const rowCells: Array<HTMLButtonElement> = []
        const label: HTMLDivElement = <div class="label">{TR909_SAMPLES[row].shortLabel}</div>
        grid.appendChild(label)
        for (let step = 0; step < STEPS; step++) {
            const classes = ["step"]
            if (step % 4 === 0) {classes.push("beat")}
            const cell: HTMLButtonElement = (
                <button
                    type="button"
                    class={classes.join(" ")}
                    onclick={() => cell.classList.toggle("on", toggleStep(engine, row, step))}/>
            )
            grid.appendChild(cell)
            rowCells.push(cell)
        }
        cells.push(rowCells)
    }
    const clearButton: HTMLButtonElement = (
        <button
            type="button"
            class="clear"
            onclick={() => {
                clearPattern(engine)
                for (const rowCells of cells) {
                    for (const cell of rowCells) {
                        cell.classList.remove("on")
                    }
                }
            }}>Clear</button>
    )
    const root: HTMLDivElement = (
        <div class="drum-machine">
            {grid}
            <div class="toolbar">{clearButton}</div>
        </div>
    )
    let running = true
    terminator.own({
        terminate: () => {
            running = false
            engine.terminate()
        }
    })
    const watchPlayhead = () => {
        if (!running) {return}
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
    requestAnimationFrame(watchPlayhead)
    return root
}

export const DrumComputerSlide = () => {
    const terminator = new Terminator()

    const onConnect = (host: HTMLElement) => {
        const watch = () => {
            if (!host.isConnected) {
                terminator.terminate()
                return
            }
            requestAnimationFrame(watch)
        }
        requestAnimationFrame(watch)
    }

    return (
        <Slide eyebrow="openDAW SDK" headline="A drum computer.">
            <div class={className} onConnect={onConnect}>
                <Await
                    factory={() => Promises.makeAbortable(terminator, createDrumComputerEngine())}
                    loading={() => <div class="status">Loading TR-909 kit…</div>}
                    success={(engine: DrumComputerEngine) => [
                        <div class="status">TR-909 · 120 BPM · Click steps to play</div>,
                        <DrumGrid engine={engine} terminator={terminator}/>
                    ]}
                    failure={({reason, retry}) => (
                        <div class="status">
                            Failed to start: {String(reason)}
                            <button type="button" onclick={retry}>Retry</button>
                        </div>
                    )}
                />
            </div>
        </Slide>
    )
}
