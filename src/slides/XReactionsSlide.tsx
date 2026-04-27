import css from "./XReactionsSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "XReactions")

const SHOTS: ReadonlyArray<string> = [
    "/images/x.001.webp",
    "/images/x.002.webp",
    "/images/x.003.webp"
]

export const XReactionsSlide = () => (
    <Slide eyebrow="X" headline="Reactions">
        <div class={className}>
            {SHOTS.map((src) => <img src={src} alt=""/>)}
        </div>
    </Slide>
)
