import css from "./OpenDAWSDKSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "OpenDAWSDK")

type Package = {
    readonly name: string
    readonly core?: boolean
}

const SDK_PACKAGES: ReadonlyArray<Package> = [
    {name: "lib-std"},
    {name: "lib-dom"},
    {name: "lib-jsx"},
    {name: "lib-box"},
    {name: "lib-dsp"},
    {name: "lib-runtime"},
    {name: "lib-fusion"},
    {name: "lib-midi"},
    {name: "lib-xml"},
    {name: "lib-dawproject"},
    {name: "studio-core", core: true},
    {name: "studio-adapters", core: true},
    {name: "studio-boxes", core: true},
    {name: "studio-enums", core: true}
]

export const OpenDAWSDKSlide = () => (
    <Slide eyebrow="openDAW SDK" headline="Build your own DAW.">
        <div class={className}>
            <div class="cloud">
                {SDK_PACKAGES.map(pkg => (
                    <span class={pkg.core === true ? "pill core" : "pill"}>{pkg.name}</span>
                ))}
            </div>
            <div class="content">
                <pre class="snippet">
                    <span class="key">"@opendaw/studio-sdk"</span>: <span class="value">"^0.0.132"</span>
                </pre>
                <ul class="bullets">
                    <li>One line package dependency.</li>
                    <li>Tree-shakable.</li>
                    <li>Lots of useful code and data structures.</li>
                    <li>Audio engine with stock devices.</li>
                </ul>
            </div>
        </div>
    </Slide>
)
