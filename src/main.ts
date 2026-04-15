import "./styles.sass"
import {initializeColors} from "@opendaw/studio-enums"
import {OPENDAW_SDK_VERSION} from "@opendaw/studio-sdk"
import {AnimationFrame} from "@opendaw/lib-dom"
import {RouteLocation} from "@opendaw/lib-jsx"
import {App} from "@/App"
import {loadFonts} from "@/Fonts"

const ROUTE_BASE = import.meta.env.BASE_URL.replace(/\/$/, "")
if (ROUTE_BASE !== "") {
    const proto = RouteLocation.prototype as RouteLocation
    const origPath = Object.getOwnPropertyDescriptor(proto, "path")!.get!
    Object.defineProperty(proto, "path", {
        configurable: true,
        get(this: RouteLocation): string {
            const p: string = origPath.call(this)
            if (p === ROUTE_BASE || p === `${ROUTE_BASE}/`) {return "/"}
            return p.startsWith(`${ROUTE_BASE}/`) ? p.slice(ROUTE_BASE.length) : p
        }
    })
    const origNav = proto.navigateTo
    proto.navigateTo = function(this: RouteLocation, path: string): boolean {
        return origNav.call(this, `${ROUTE_BASE}${path}`)
    }
}

initializeColors(document.documentElement)
console.debug(`openDAW SDK ${OPENDAW_SDK_VERSION}`)

await loadFonts()

const stage = document.createElement("div")
stage.className = "stage-1080"
stage.appendChild(App())
document.body.appendChild(stage)

AnimationFrame.start(window)

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
