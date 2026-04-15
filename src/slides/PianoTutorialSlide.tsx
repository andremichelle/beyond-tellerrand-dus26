import css from "./PianoTutorialSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "PianoTutorial")

const VIDEO_URL = "/opendaw/video/piano-tutorial.mp4"

export const PianoTutorialSlide = () => {
    const video: HTMLVideoElement = (
        <video src={VIDEO_URL} playsinline controls/>
    )
    return (
        <Slide eyebrow="Piano Tutorial" headline="Teach yourself inside openDAW.">
            <div class={className}>{video}</div>
        </Slide>
    )
}
