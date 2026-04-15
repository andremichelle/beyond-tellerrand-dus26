import css from "./OpenDAWStatsSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "OpenDAWStats")

const IMAGE = "/images/opendaw-stats.png"

export const OpenDAWStatsSlide = () => (
    <Slide eyebrow="openDAW" headline="By the numbers.">
        <div class={className}>
            <img src={IMAGE} alt="openDAW stats"/>
        </div>
    </Slide>
)
