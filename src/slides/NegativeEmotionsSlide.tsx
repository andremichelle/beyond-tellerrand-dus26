import css from "./NegativeEmotionsSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "NegativeEmotions")

export const NegativeEmotionsSlide = () => (
    <Slide eyebrow="Negative emotions" headline="Put them to work.">
        <div class={className}>
            <ul class="bullets">
                <li>Channel anger into focused work.</li>
                <li>Turn spite into determination.</li>
                <li>Reclaim what you always believed in.</li>
            </ul>
        </div>
    </Slide>
)
