import css from "./OpenDAWFeaturesSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "OpenDAWFeatures")

const FEATURES: ReadonlyArray<string> = [
    "MIDI In / Out",
    "Audio In / Out",
    "Audio Buses",
    "Aux Send FX",
    "Automation",
    "Audio Recording",
    "MIDI Recording",
    "MIDI Learn",
    "Undo / Redo",
    "Mixer",
    "Device Panel",
    "Note Editor",
    "Shadertoy Visualizer",
    "Scriptable Devices",
    "Script Editor",
    "Monitoring with FX",
    "STEM In / Out",
    "Cloud Backup",
    "Soundfonts",
    "LiveRooms",
    "Shortcut Manager",
    "DAWproject In / Out",
    "Piano Tutorial Mode",
    "Video Export"
]

export const OpenDAWFeaturesSlide = () => (
    <Slide eyebrow="openDAW" headline="All the features.">
        <div class={className}>
            <div class="grid">
                {FEATURES.map(feature => <div class="item">{feature}</div>)}
            </div>
        </div>
    </Slide>
)
