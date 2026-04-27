import css from "./DoItAnywaySlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "DoItAnyway")

export const DoItAnywaySlide = () => (
    <section className={`slide ${className}`}>
        <p>F*ck them.<br/>I am doing it anyway!</p>
    </section>
)
