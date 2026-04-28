import css from "./DeloungeSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {FlashMovie} from "@/components/FlashMovie"

const className = Html.adoptStyleSheet(css, "Delounge")

const BASE = "/misc/"

export const DeloungeSlide = () => (
    <Slide eyebrow="Flash 4" headline="delounge.">
        <div class={className}>
            <div class="stage">
                <FlashMovie
                    src={`${BASE}delounge.swf`}
                    width={300}
                    height={300}
                    scale={2}
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
