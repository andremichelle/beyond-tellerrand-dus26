import css from "./BackgroundSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Background")

const PHOTO = "/images/am-90s.jpeg"

export const BackgroundSlide = () => (
    <Slide eyebrow="Background" headline="A few things about me.">
        <div class={className}>
            <figure class="figure">
                <img class="photo" src={PHOTO} alt="André Michelle, 2009"/>
            </figure>
            <ul class="bullets">
                <li>Techno DJ in the 90s.</li>
                <li>I was always broke and promised myself: if I ever made it, I’d build music studios for people like me.</li>
                <li>No training in coding or design.</li>
                <li>Started with Flash 4.</li>
                <li>Got really good at it?</li>
                <li>Known for hacky workarounds.</li>
            </ul>
        </div>
    </Slide>
)
