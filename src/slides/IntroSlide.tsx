import css from "./IntroSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Intro")

export const IntroSlide = () => (
    <Slide eyebrow="beyond tellerrand · DUS26" headline="Why You Should Do It Anyway!">
        <div className={className}>
            <h1>André Michelle</h1>
            <h2>andre.michelle@opendaw.org</h2>
            <p>Founder of openDAW, a new holistic exploration of music creation inside your browser.</p>
        </div>
    </Slide>
)