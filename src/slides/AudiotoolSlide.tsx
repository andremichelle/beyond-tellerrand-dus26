import css from "./AudiotoolSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Audiotool")

const SCREENSHOT = "/images/audiotool.png"

export const AudiotoolSlide = () => (
    <Slide eyebrow="Audiotool 2007/10" headline="The Audiotool in the room.">
        <div class={className}>
            <img class="shot" src={SCREENSHOT} alt="Audiotool"/>
            <ul class="bullets">
                <li>Moving to Cologne.</li>
                <li>Got paid for my dream project.</li>
                <li>No boundaries.</li>
                <li>No business model.</li>
                <li>Parent company Hobnox closed doors.</li>
                <li>Restarting 2010 with Des Pudels Kern.</li>
                <li>Closed 2012.</li>
                <li>Restart in a handshake setup.</li>
                <li>Crossing one million user.</li>
                <li>Two developers.</li>
                <li>Still no business model.</li>
                <li>Chaotic management.</li>
                <li>Slow burn-out.</li>
                <li><strong>But... I learnt so much about everything!</strong></li>
            </ul>
        </div>
    </Slide>
)
