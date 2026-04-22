import css from "./RiffleSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Riffle")

const SHOT = "/images/riffle-screenshot.webp"

export const RiffleSlide = () => (
    <Slide eyebrow="Riffle" headline="Built on openDAW.">
        <div class={className}>
            <img class="shot" src={SHOT} alt="Riffle"/>
            <ul class="bullets">
                <li><strong>Riffle.studio</strong></li>
                <li>Goto market in less than 9 months</li>
            </ul>
        </div>
    </Slide>
)
