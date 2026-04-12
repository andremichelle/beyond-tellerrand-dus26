import {createElement} from "@opendaw/lib-jsx"
import {PageContext} from "@opendaw/lib-jsx"
import {Slide} from "@/Slide"
import {SlideService} from "@/slides"

export const DemoSlide = ({lifecycle}: PageContext<SlideService>) => {
    const pads: Array<HTMLDivElement> = []
    for (let index = 0; index < 16; index++) {
        pads.push(<div className="pad">{String(index + 1).padStart(2, "0")}</div>)
    }
    let cursor = 0
    const interval = window.setInterval(() => {
        pads[cursor].classList.remove("lit")
        cursor = (cursor + 1) % pads.length
        pads[cursor].classList.add("lit")
    }, 180)
    lifecycle.own({terminate: () => window.clearInterval(interval)})
    return (
        <Slide eyebrow="Live demo" headline="Step sequencer in 16 squares.">
            <p>
                Each cell below is a regular <code>&lt;div&gt;</code>. The lit pad walks through
                the grid using the <strong>page lifecycle</strong> from openDAW's tiny JSX router —
                navigate away and the timer is cleaned up automatically.
            </p>
            <div className="demo-grid">
                {pads}
            </div>
        </Slide>
    )
}
