import css from "./SyncboxSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {FlashMovie} from "@/components/FlashMovie"

const className = Html.adoptStyleSheet(css, "Syncbox")

const BASE = "/misc/"
const SWF = `${BASE}syncbox.swf`
const ORIGIN_WIDTH = 500
const ORIGIN_HEIGHT = 500
const SCALE = 1

export const SyncboxSlide = () => (
    <Slide eyebrow="Flash 6" headline="syncbox.">
        <div class={className}>
            <div class="stage">
                <FlashMovie
                    src={SWF}
                    width={ORIGIN_WIDTH}
                    height={ORIGIN_HEIGHT}
                    scale={SCALE}
                    base={BASE}
                    quality="medium"
                />
            </div>
            <ul class="bullets">
                <li>Synchronizing loop with animation.</li>
                <li>Still static.</li>
            </ul>
        </div>
    </Slide>
)
