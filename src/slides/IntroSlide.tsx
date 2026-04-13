import css from "./IntroSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Intro")

export const IntroSlide = () => (
    <Slide eyebrow="beyond tellerrand · DUS26" headline="Why You Should Do It Anyway!">
        <div className={className}>
            <h1>André Michelle</h1>
            <h2>Web developer since 1998</h2>
            <h3>andre.michelle@opendaw.org</h3>
            <p>Founder of openDAW, a music creation environment that runs in the browser.</p>
        </div>
    </Slide>
)