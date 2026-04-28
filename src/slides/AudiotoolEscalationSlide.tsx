import css from "./AudiotoolEscalationSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "AudiotoolEscalation")

const SCREENSHOT = "/images/github.webp"

export const AudiotoolEscalationSlide = () => (
    <Slide eyebrow="Audiotool" headline="Escalation.">
        <div class={className}>
            <img class="shot" src={SCREENSHOT} alt="Audiotool escalation"/>
            <ul class="bullets">
                <li>Expressed displeasure about constantly moving goals and mismanagement.</li>
                <li>Contract got <strong>immediately</strong> terminated.</li>
                <li>It felt like losing not just 16 years of work, but a project that shaped a third of my life.</li>
                <li>Still in court fighting for my promised shares after more than 2 years.</li>
            </ul>
        </div>
    </Slide>
)
