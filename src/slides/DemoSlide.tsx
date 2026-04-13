import css from "./DemoSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {PageContext} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {SlideService} from "@/index"

const className = Html.adoptStyleSheet(css, "Demo")

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
            <div className={className}>
                <p>
                    Each cell below is a regular <code>&lt;div&gt;</code>. The lit pad walks through
                    the grid using the <strong>page lifecycle</strong> from openDAW's tiny JSX router.
                    Navigate away and the timer is cleaned up automatically.
                </p>
                <div className="grid">
                    {pads}
                </div>
            </div>
        </Slide>
    )
}
