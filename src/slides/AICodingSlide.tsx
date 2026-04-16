import css from "./AICodingSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "AICoding")

const SHOT = "/images/bender.png"

export const AICodingSlide = () => (
    <Slide eyebrow="AI Coding" headline="How I work with the machine.">
        <div class={className}>
            <img class="shot" src={SHOT} alt="Bender"/>
            <div class="text">
                <h2>The prompt is the code!</h2>
                <p className="caption">
                    Natural language is the final code language as it always should have been.
                </p>
                <ul>
                    <li>Make a plan and document all changes to <strong>/plans/foo.md</strong>.</li>
                    <li>Ask relentlessly questions (one by one), until you are good to go.</li>
                    <li>Make a dry run and present all arising issues (one by one).</li>
                    <li>Write tests as much as possible. Cover all cases.</li>
                    <li><strong>Read the plan!</strong></li>
                    <li><strong>Never blindly trust an AI!</strong></li>
                    <li>Implement meaningful steps that compile and can be reviewed.</li>
                </ul>
            </div>
        </div>
    </Slide>
)
