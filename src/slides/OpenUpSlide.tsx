import css from "./OpenUpSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "OpenUp")

const VIDEO_URL = "/opendaw/video/open-up.mp4"

export const OpenUpSlide = () => {
    const video: HTMLVideoElement = (
        <video src={VIDEO_URL} playsinline controls/>
    )
    return (
        <Slide eyebrow="Ilir Bajri" headline="Open Up">
            <div class={className}>{video}</div>
        </Slide>
    )
}
