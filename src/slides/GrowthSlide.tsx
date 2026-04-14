import css from "./GrowthSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Growth")

export const GrowthSlide = () => (
    <Slide eyebrow="" headline="The obligatory quote.">
        <div class={className}>
            <blockquote>
                We tend to measure progress by what we've gained, but there is just as
                much growth in <strong>what we no longer tolerate</strong>,
                <strong> what we no longer chase</strong>,
                <strong> what we no longer try to fix</strong>.
            </blockquote>
        </div>
    </Slide>
)
