import css from "./IntroSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Intro")

export const IntroSlide = () => (
    <Slide eyebrow="beyond tellerrand · DUS26" headline="Why You Should Do It Anyway!">
        <div className={className}>
            <h1>André Michelle</h1>
            <h2>https://github.com/andremichelle/</h2>
        </div>
    </Slide>
)