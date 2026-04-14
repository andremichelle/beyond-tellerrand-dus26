import {PageFactory} from "@opendaw/lib-jsx"
import {IntroSlide} from "@/slides/IntroSlide"
import {AboutMeSlide} from "@/slides/AboutMeSlide"
import {BackgroundSlide} from "@/slides/BackgroundSlide"
import {GloryFlashDaysSlide} from "@/slides/GloryFlashDaysSlide"
import {DeloungeSlide} from "@/slides/DeloungeSlide"
import {SyncboxSlide} from "@/slides/SyncboxSlide"
import {KalimbaSlide} from "@/slides/KalimbaSlide"
import {BasementMXSlide} from "@/slides/BasementMXSlide"
import {DigitalAudioSlide} from "@/slides/DigitalAudioSlide"
import {FlashAudioHackSlide} from "@/slides/FlashAudioHackSlide"
import {EightBitBoySlide} from "@/slides/EightBitBoySlide"
import {ToneMatrixSlide} from "@/slides/ToneMatrixSlide"
import {PulsateSlide} from "@/slides/PulsateSlide"
import {PreAudiotoolEraSlide} from "@/slides/PreAudiotoolEraSlide"
import {AudiotoolSlide} from "@/slides/AudiotoolSlide"
import {AudiotoolEscalationSlide} from "@/slides/AudiotoolEscalationSlide"
import {StepBackSlide} from "@/slides/StepBackSlide"
import {OpenDAWIdeasSlide} from "@/slides/OpenDAWIdeasSlide"
import {OpenDAWAmbassadorsSlide} from "@/slides/OpenDAWAmbassadorsSlide"
import {OpenDAWSnapshotsSlide} from "@/slides/OpenDAWSnapshotsSlide"
import {OpenDAWTodaySlide} from "@/slides/OpenDAWTodaySlide"
import {ExternalGearSlide} from "@/slides/ExternalGearSlide"
import {OpenDAWSDKSlide} from "@/slides/OpenDAWSDKSlide"
import {LibJsxSlide} from "@/slides/LibJsxSlide"
import {TechnoSetupSlide} from "@/slides/TechnoSetupSlide"
import {GrowthSlide} from "@/slides/GrowthSlide"
import {DemoTimeSlide} from "@/slides/DemoTimeSlide"

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
    {path: "/digital-audio", title: "Digital Audio", factory: DigitalAudioSlide},
    {path: "/flash-audio-hack", title: "Flash Audio Hack", factory: FlashAudioHackSlide},
    {path: "/8bitboy", title: "8Bitboy", factory: EightBitBoySlide},
    {path: "/tonematrix", title: "ToneMatrix", factory: ToneMatrixSlide},
    {path: "/pulsate", title: "Pulsate", factory: PulsateSlide},
    {path: "/pre-audiotool-era", title: "Pre Audiotool Era", factory: PreAudiotoolEraSlide},
    {path: "/audiotool", title: "Audiotool", factory: AudiotoolSlide},
    {path: "/audiotool-escalation", title: "Audiotool Escalation", factory: AudiotoolEscalationSlide},
    {path: "/step-back", title: "Step Back", factory: StepBackSlide},
    {path: "/opendaw-ideas", title: "openDAW Ideas", factory: OpenDAWIdeasSlide},
    {path: "/opendaw-ambassadors", title: "openDAW Ambassadors", factory: OpenDAWAmbassadorsSlide},
    {path: "/opendaw-snapshots", title: "openDAW Snapshots", factory: OpenDAWSnapshotsSlide},
    {path: "/opendaw-today", title: "openDAW Today", factory: OpenDAWTodaySlide},
    {path: "/external-gear", title: "External Gear", factory: ExternalGearSlide},
    {path: "/opendaw-sdk", title: "openDAW SDK", factory: OpenDAWSDKSlide},
    {path: "/lib-jsx", title: "lib-jsx", factory: LibJsxSlide},
    {path: "/techno-setup", title: "Techno Setup", factory: TechnoSetupSlide},
    {path: "/growth", title: "Growth", factory: GrowthSlide},
    {path: "/demo-time", title: "Demo Time", factory: DemoTimeSlide}
]