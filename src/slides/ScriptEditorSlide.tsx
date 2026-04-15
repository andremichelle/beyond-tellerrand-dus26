import css from "./ScriptEditorSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "ScriptEditor")

const VIDEO_URL = "/opendaw/video/script-editor.mp4"

export const ScriptEditorSlide = () => {
    const video: HTMLVideoElement = (
        <video src={VIDEO_URL} playsinline controls/>
    )
    return (
        <Slide eyebrow="Script Editor" headline="Write code inside openDAW.">
            <div class={className}>{video}</div>
        </Slide>
    )
}
