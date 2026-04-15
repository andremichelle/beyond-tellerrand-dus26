import css from "./ExternalGearSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "ExternalGear")

const VIDEO_URL = "/opendaw/video/2600.mp4"

export const ExternalGearSlide = () => {
    const video: HTMLVideoElement = (
        <video src={VIDEO_URL} playsinline controls/>
    )
    return (
        <Slide eyebrow="External Gear" headline="openDAW talks to your gear.">
            <div class={className}>{video}</div>
        </Slide>
    )
}
