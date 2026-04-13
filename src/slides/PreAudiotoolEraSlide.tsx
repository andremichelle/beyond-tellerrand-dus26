import css from "./PreAudiotoolEraSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "PreAudiotoolEra")

const SCREENSHOT = "/images/pre-audiotool-era.png"

export const PreAudiotoolEraSlide = () => (
    <Slide eyebrow="Pre Audiotool Era" headline="The first building steps towards a complete Web DAW.">
        <div class={className}>
            <img class="shot" src={SCREENSHOT} alt="Pre Audiotool era"/>
            <ul class="bullets">
                <li>FL909, a Roland TR-909 clone in Flash.</li>
                <li>MC-202, a Roland MC-202 clone in Flash.</li>
                <li>Direct precursors of <strong>audiotool.com</strong>.</li>
            </ul>
        </div>
    </Slide>
)
