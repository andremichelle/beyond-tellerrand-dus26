import css from "./StepBackSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "StepBack")

const SHOT = "/images/me-futurama-flat.webp"

export const StepBackSlide = () => (
    <Slide eyebrow="Dark times" headline="Taking a step back.">
        <div class={className}>
            <img class="shot" src={SHOT} alt="Taking a step back"/>
            <ul class="bullets">
                <li>A huge step back.</li>
                <li>Revisiting all decisions I made.</li>
                <li>Using the time to remember why I actually started Audiotool in the first place.</li>
                <li>I realized I gained something just as valuable:<br/>
                    <strong>knowledge and experience</strong>.
                </li>
            </ul>
        </div>
    </Slide>
)
