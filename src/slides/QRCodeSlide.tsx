import css from "./QRCodeSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "QRCode")

const QR_URL = "/images/qr.svg"
const TARGET = "andremichelle.github.io/beyond-tellerrand-dus26"

export const QRCodeSlide = () => {
    return (
        <Slide eyebrow="Thank You!" headline="Take the slides with you.">
            <div class={className}>
                <img src={QR_URL} alt="QR code"/>
                <div class="url">{TARGET}</div>
            </div>
        </Slide>
    )
}
