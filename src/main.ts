import "./styles.sass"
import {initializeColors} from "@opendaw/studio-enums"
import {OPENDAW_SDK_VERSION} from "@opendaw/studio-sdk"
import {App} from "@/App"

initializeColors(document.documentElement)
console.debug(`openDAW SDK ${OPENDAW_SDK_VERSION}`)
document.body.appendChild(App())
