import "./styles.sass"
import {initializeColors} from "@opendaw/studio-enums"
import {OPENDAW_SDK_VERSION} from "@opendaw/studio-sdk"
import {App} from "@/App"
import {loadFonts} from "@/Fonts"

initializeColors(document.documentElement)
console.debug(`openDAW SDK ${OPENDAW_SDK_VERSION}`)

await loadFonts()

const stage = document.createElement("div")
stage.className = "stage-1080"
stage.appendChild(App())
document.body.appendChild(stage)

const updateScale = () => {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
    const tx = (window.innerWidth - 1920 * scale) / 2
    const ty = (window.innerHeight - 1080 * scale) / 2
    const root = document.documentElement
    root.style.setProperty("--stage-scale", String(scale))
    root.style.setProperty("--stage-x", `${tx}px`)
    root.style.setProperty("--stage-y", `${ty}px`)
}
updateScale()
window.addEventListener("resize", updateScale)
