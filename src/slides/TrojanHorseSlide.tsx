import css from "./TrojanHorseSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "TrojanHorse")

const SHOT = "/images/bitwig-goes-openDAW.webp"

export const TrojanHorseSlide = () => (
    <Slide eyebrow="Trojan Horse" headline="Guerilla Marketing">
        <div class={className}>
            <img src={SHOT} alt="Bitwig goes openDAW"/>
        </div>
    </Slide>
)
