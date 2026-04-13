import css from "./DeloungeSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {FlashMovie} from "@/components/FlashMovie"

const className = Html.adoptStyleSheet(css, "Delounge")

const BASE = "/misc/"
const SWF = `${BASE}delounge.swf`
const ORIGIN_WIDTH = 300
const ORIGIN_HEIGHT = 300
const SCALE = 2

export const DeloungeSlide = () => (
    <Slide eyebrow="Flash 5 · early 2000" headline="delounge.">
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
                <li>Playing static loops.</li>
                <li>Being goofy.</li>
            </ul>
        </div>
    </Slide>
)
