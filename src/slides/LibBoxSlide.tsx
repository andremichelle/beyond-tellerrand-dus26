import css from "./LibBoxSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "LibBox")

const SHOT = "/images/graph.png"

export const LibBoxSlide = () => (
    <Slide eyebrow="lib-box" headline="A graph of boxes.">
        <div class={className}>
            <img class="shot" src={SHOT} alt="Box graph"/>
            <ul class="bullets">
                <li><strong>lib-box</strong> graph data structure.</li>
                <li>Schema driven.</li>
                <li>Source code generator.</li>
                <li>Easy to extend.</li>
                <li>Pointers.</li>
            </ul>
        </div>
    </Slide>
)
