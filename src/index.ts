import {PageFactory} from "@opendaw/lib-jsx"
import {IntroSlide} from "@/slides/IntroSlide"
import {AboutMeSlide} from "@/slides/AboutMeSlide"
import {BackgroundSlide} from "@/slides/BackgroundSlide"
import {GloryFlashDaysSlide} from "@/slides/GloryFlashDaysSlide"
import {DeloungeSlide} from "@/slides/DeloungeSlide"
import {SyncboxSlide} from "@/slides/SyncboxSlide"
import {KalimbaSlide} from "@/slides/KalimbaSlide"
import {BasementMXSlide} from "@/slides/BasementMXSlide"
import {FlashAudioHackSlide} from "@/slides/FlashAudioHackSlide"
import {EightBitBoySlide} from "@/slides/EightBitBoySlide"
import {PreAudiotoolEraSlide} from "@/slides/PreAudiotoolEraSlide"
import {AudiotoolSlide} from "@/slides/AudiotoolSlide"

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
    {path: "/syncbox", title: "syncbox", factory: SyncboxSlide},
    {path: "/basementmx", title: "basementmx", factory: BasementMXSlide},
    {path: "/kalimba", title: "kalimba", factory: KalimbaSlide},
    {path: "/flash-audio-hack", title: "Flash Audio Hack", factory: FlashAudioHackSlide},
    {path: "/8bitboy", title: "8Bitboy", factory: EightBitBoySlide},
    {path: "/pre-audiotool-era", title: "Pre Audiotool Era", factory: PreAudiotoolEraSlide},
    {path: "/audiotool", title: "Audiotool", factory: AudiotoolSlide}
]