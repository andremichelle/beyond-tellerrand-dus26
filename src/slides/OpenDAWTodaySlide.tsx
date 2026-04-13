import css from "./OpenDAWTodaySlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "OpenDAWToday")

const SHOT = "/images/opendaw-box.png"

export const OpenDAWTodaySlide = () => (
    <Slide eyebrow="openDAW" headline="Where openDAW is today.">
        <div class={className}>
            <img class="shot" src={SHOT} alt="openDAW"/>
            <ul class="bullets">
                <li>openDAW is now online.</li>
                <li>Funded by two openDAW SDK consumers.</li>
                <li>Will be the tool for the next semesters at Hochschule für Musik und Tanz Köln <strong>(Cologne University of Music and Dance)</strong>.</li>
                <li>Proposed DAW for <strong>remix.ruhr</strong>.</li>
                <li>Official 1.0 release on September 1st, 2026.</li>
            </ul>
        </div>
    </Slide>
)
