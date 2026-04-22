import css from "./AboutMeSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "AboutMe")

const PORTRAIT = "/images/am.webp"

export const AboutMeSlide = () => (
    <Slide eyebrow="Who am I?" headline="André Michelle.">
        <div class={className}>
            <img class="portrait" src={PORTRAIT} alt="André Michelle"/>
            <div class="meta">
                <h2>Things I love</h2>
                <ul class="bullets">
                    <li>I love music.</li>
                    <li>I love sounds.</li>
                    <li>I love the web.</li>
                    <li>I love education.</li>
                    <li>I love creating tools.</li>
                    <li>I love open source.</li>
                    <li>We are all standing on the shoulders of giants.</li>
                </ul>
            </div>
        </div>
    </Slide>
)
