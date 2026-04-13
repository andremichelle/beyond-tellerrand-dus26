import css from "./GloryFlashDaysSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {FlashMovie} from "@/components/FlashMovie"

const className = Html.adoptStyleSheet(css, "GloryFlashDays")

const BASE = "/misc/"
const SWF = `${BASE}flash-logo.swf`
const ORIGIN_WIDTH = 320
const ORIGIN_HEIGHT = 320
const SCALE = 1.5

export const GloryFlashDaysSlide = () => (
    <Slide eyebrow="2000s" headline="The glory Flash days.">
        <div class={className}>
            <div class="logo">
                <FlashMovie
                    src={SWF}
                    width={ORIGIN_WIDTH}
                    height={ORIGIN_HEIGHT}
                    scale={SCALE}
                    base={BASE}
                    bgColor="#bababa"
                    quality="high"
                />
            </div>
            <ul class="bullets">
                <li>A creative community.</li>
                <li>Everything felt new and exciting.</li>
                <li>Every day discovered something new.</li>
                <li>Cutting edge. <em>How did they do this?</em></li>
                <li>The web felt like a huge playground.</li>
                <li>No sound API beyond playing static files.</li>
            </ul>
        </div>
    </Slide>
)
