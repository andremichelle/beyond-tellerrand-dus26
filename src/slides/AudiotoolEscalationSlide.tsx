import css from "./AudiotoolEscalationSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "AudiotoolEscalation")

const SCREENSHOT = "/images/github.png"

export const AudiotoolEscalationSlide = () => (
    <Slide eyebrow="Audiotool Escalation" headline="It fell apart.">
        <div class={className}>
            <img class="shot" src={SCREENSHOT} alt="Audiotool escalation"/>
            <ul class="bullets">
                <li>Expressed displeasure about constantly moving goals.</li>
                <li>Contract got terminated.</li>
                <li>Everything fell apart for a few months.</li>
                <li>Still in court after more than 2 years.</li>
            </ul>
        </div>
    </Slide>
)
