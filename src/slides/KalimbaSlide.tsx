import css from "./KalimbaSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {FlashMovie} from "@/components/FlashMovie"

const className = Html.adoptStyleSheet(css, "Kalimba")

const BASE = "/misc/"
const SWF = `${BASE}kalimba.swf`
const ORIGIN_WIDTH = 400
const ORIGIN_HEIGHT = 175
const SCALE = 2

export const KalimbaSlide = () => (
    <Slide eyebrow="Flash 6" headline="kalimba.">
        <div class={className}>
            <div class="stage">
                <FlashMovie
                    src={SWF}
                    width={ORIGIN_WIDTH}
                    height={ORIGIN_HEIGHT}
                    scale={SCALE}
                    base={BASE}
                    quality="high"
                />
            </div>
            <ul class="bullets">
                <li>Sequencing with onSoundComplete blind loop.</li>
                <li>Feels more dynamic.</li>
            </ul>
        </div>
    </Slide>
)
