import css from "./OpenDAWIdeasSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "OpenDAWIdeas")

const SHOT = "/images/opendaw.png"

export const OpenDAWIdeasSlide = () => (
    <Slide eyebrow="openDAW" headline="Why You Should Do It Anyway!">
        <div class={className}>
            <img class="shot" src={SHOT} alt="openDAW"/>
            <ul class="bullets">
                <li>Everybody should be able to make music for free.</li>
                <li>Open-source. If everybody owns it, nobody can steal it.</li>
                <li>Merge education and fun.</li>
                <li>Data privacy is a priority.</li>
                <li>No cookie banner.</li>
                <li>No accounts. Go to <strong>opendaw.studio</strong> and start creating.</li>
                <li>Free to use.</li>
                <li>No AI music generation.</li>
                <li>Live collaboration for virtual classrooms and hangouts.</li>
                <li>Taking it step by step.</li>
                <li>No investors.</li>
                <li>Talking to musicians.</li>
                <li>Talking to music teachers.</li>
                <li>Finding ambassadors to help spread the news.</li>
            </ul>
        </div>
    </Slide>
)
