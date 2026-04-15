import css from "./Orange3Slide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "Orange3")

const VIDEO_URL = "/opendaw/video/orange3.mp4"

export const Orange3Slide = () => {
    const video: HTMLVideoElement = (
        <video src={VIDEO_URL} playsinline controls/>
    )
    return (
        <Slide eyebrow="orange3" headline="The same project, exported to video.">
            <div class={className}>{video}</div>
        </Slide>
    )
}
