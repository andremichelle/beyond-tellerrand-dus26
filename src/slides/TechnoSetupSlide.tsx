import css from "./TechnoSetupSlide.sass?inline"
import {Terminator} from "@opendaw/lib-std"
import {Await, createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Promises} from "@opendaw/lib-runtime"
import {PPQN} from "@opendaw/lib-dsp"
import {Slide} from "@/Slide"
import {clearPattern, createDrumComputerEngine, DrumComputerEngine, toggleStep} from "./drum-computer/engine-setup"
import {TR909_SAMPLES} from "./drum-computer/samples"
import {Knob} from "./drum-computer/Knob"
import {KnobParameter} from "./drum-computer/knob-parameter"

const className = Html.adoptStyleSheet(css, "TechnoSetup")

const STEPS = 16
const STEP_PPQN = PPQN.SemiQuaver
const LOOP_PPQN = PPQN.Bar

const KnobColumn = ({title, parameters, terminator}: {
    title: string
    parameters: ReadonlyArray<KnobParameter>
    terminator: Terminator
}) => {
    const cells: Array<HTMLDivElement> = parameters.map(param => Knob({parameter: param, terminator}))
    const root: HTMLDivElement = (
        <div class="knob-column">
            <div class="title">{title}</div>
            <div class="knobs">{cells}</div>
        </div>
    )
    return root
}

const DrumGrid = ({engine, terminator}: {engine: DrumComputerEngine, terminator: Terminator}) => {
    const grid: HTMLDivElement = <div class="grid"/>
    const playheadDots: Array<HTMLDivElement> = []
    grid.appendChild(<div class="label"/>)
    for (let step = 0; step < STEPS; step++) {
        const dot: HTMLDivElement = <div class="dot"/>
        grid.appendChild(dot)
        playheadDots.push(dot)
    }
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
    let playing = false
    const playPauseButton: HTMLButtonElement = (
        <button
            type="button"
            class="playpause"
            onclick={() => {
                if (playing) {
                    engine.project.engine.stop(true)
                    playing = false
                    playPauseButton.textContent = "Play"
                    playPauseButton.classList.remove("playing")
                } else {
                    engine.project.engine.play()
                    playing = true
                    playPauseButton.textContent = "Pause"
                    playPauseButton.classList.add("playing")
                }
            }}>Play</button>
    )
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
            <div class="toolbar">{playPauseButton}{clearButton}</div>
        </div>
    )
    terminator.own({terminate: () => engine.terminate()})
    let lastStep = -1
    const render = (pulses: number) => {
        const position = ((pulses % LOOP_PPQN) + LOOP_PPQN) % LOOP_PPQN
        const currentStep = Math.floor(position / STEP_PPQN) % STEPS
        if (currentStep === lastStep) {return}
        lastStep = currentStep
        for (let row = 0; row < cells.length; row++) {
            const rowCells = cells[row]
            for (let step = 0; step < rowCells.length; step++) {
                rowCells[step].classList.toggle("playing", step === currentStep)
            }
        }
        for (let step = 0; step < playheadDots.length; step++) {
            playheadDots[step].classList.toggle("active", step === currentStep)
        }
    }
    terminator.own(engine.project.engine.position.catchupAndSubscribe(owner => render(owner.getValue())))
    return root
}

export const TechnoSetupSlide = () => {
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
        <Slide eyebrow="openDAW SDK" headline="Techno setup.">
            <div class={className} onConnect={onConnect}>
                <Await
                    factory={() => Promises.makeAbortable(terminator, createDrumComputerEngine())}
                    loading={() => <div class="status">Loading TR-909 and TB-303…</div>}
                    success={(engine: DrumComputerEngine) => [
                        <div class="status">TR-909 · TB-303 · 126 BPM</div>,
                        <div class="stage">
                            <DrumGrid engine={engine} terminator={terminator}/>
                            <KnobColumn title="TB-303" parameters={engine.apparatParameters} terminator={terminator}/>
                            <KnobColumn title="303 Sequencer" parameters={engine.spielwerkParameters} terminator={terminator}/>
                        </div>
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
