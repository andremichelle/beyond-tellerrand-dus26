import css from "./DemoTimeSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "DemoTime")

export const DemoTimeSlide = () => (
    <Slide eyebrow="openDAW" headline="">
        <div class={className}>
            <h1>DEMO TIME</h1>
        </div>
    </Slide>
)
