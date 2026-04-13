import {PageFactory} from "@opendaw/lib-jsx"
import {IntroSlide} from "@/slides/IntroSlide"
import {AboutMeSlide} from "@/slides/AboutMeSlide"
import {BackgroundSlide} from "@/slides/BackgroundSlide"
import {GloryFlashDaysSlide} from "@/slides/GloryFlashDaysSlide"
import {DeloungeSlide} from "@/slides/DeloungeSlide"
import {DemoSlide} from "@/slides/DemoSlide"
import {BasementMXSlide} from "@/slides/BasementMXSlide"
import {FlashAudioHackSlide} from "@/slides/FlashAudioHackSlide"
import {EightBitBoySlide} from "@/slides/EightBitBoySlide"
import {PreAudiotoolEraSlide} from "@/slides/PreAudiotoolEraSlide"

export type SlideService = void

export type SlideEntry = {
    path: string
    title: string
    factory: PageFactory<SlideService>
}

export const SLIDES: ReadonlyArray<SlideEntry> = [
    {path: "/", title: "Intro", factory: IntroSlide},
    {path: "/about", title: "About Me", factory: AboutMeSlide},
    {path: "/background", title: "Background", factory: BackgroundSlide},
    {path: "/glory-flash-days", title: "Glory Flash Days", factory: GloryFlashDaysSlide},
    {path: "/delounge", title: "delounge", factory: DeloungeSlide},
    {path: "/basementmx", title: "basementmx", factory: BasementMXSlide},
    {path: "/flash-audio-hack", title: "Flash Audio Hack", factory: FlashAudioHackSlide},
    {path: "/8bitboy", title: "8Bitboy", factory: EightBitBoySlide},
    {path: "/pre-audiotool-era", title: "Pre Audiotool Era", factory: PreAudiotoolEraSlide},
    {path: "/demo", title: "Demo", factory: DemoSlide}
]