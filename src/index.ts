import {PageFactory} from "@opendaw/lib-jsx"
import {IntroSlide} from "@/slides/IntroSlide"
import {DemoSlide} from "@/slides/DemoSlide"
import {BasementMXSlide} from "@/slides/BasementMXSlide"
import {FlashAudioHackSlide} from "@/slides/FlashAudioHackSlide"

export type SlideService = void

export type SlideEntry = {
    path: string
    title: string
    factory: PageFactory<SlideService>
}

export const SLIDES: ReadonlyArray<SlideEntry> = [
    {path: "/", title: "Intro", factory: IntroSlide},
    {path: "/basementmx", title: "basementmx", factory: BasementMXSlide},
    {path: "/flash-audio-hack", title: "Flash Audio Hack", factory: FlashAudioHackSlide},
    {path: "/demo", title: "Demo", factory: DemoSlide}
]