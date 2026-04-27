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
import {NegativeEmotionsSlide} from "@/slides/NegativeEmotionsSlide"
import {OpenDAWIdeasSlide} from "@/slides/OpenDAWIdeasSlide"
import {OpenDAWAmbassadorsSlide} from "@/slides/OpenDAWAmbassadorsSlide"
import {TrojanHorseSlide} from "@/slides/TrojanHorseSlide"
import {XReactionsSlide} from "@/slides/XReactionsSlide"
import {DoItAnywaySlide} from "@/slides/DoItAnywaySlide"
import {OpenDAWSnapshotsSlide} from "@/slides/OpenDAWSnapshotsSlide"
import {OpenDAWTodaySlide} from "@/slides/OpenDAWTodaySlide"
import {OpenDAWStatsSlide} from "@/slides/OpenDAWStatsSlide"
import {ExternalGearSlide} from "@/slides/ExternalGearSlide"
import {OpenDAWFeaturesSlide} from "@/slides/OpenDAWFeaturesSlide"
import {ScriptEditorSlide} from "@/slides/ScriptEditorSlide"
import {PianoTutorialSlide} from "@/slides/PianoTutorialSlide"
import {OpenDAWSDKSlide} from "@/slides/OpenDAWSDKSlide"
import {RiffleSlide} from "@/slides/RiffleSlide"
import {LibJsxSlide} from "@/slides/LibJsxSlide"
import {LibBoxSlide} from "@/slides/LibBoxSlide"
import {Orange3Slide} from "@/slides/Orange3Slide"
import {OpenUpSlide} from "@/slides/OpenUpSlide"
import {TechnoSetupSlide} from "@/slides/TechnoSetupSlide"
import {AICodingSlide} from "@/slides/AICodingSlide"
import {DemoTimeSlide} from "@/slides/DemoTimeSlide"
import {QRCodeSlide} from "@/slides/QRCodeSlide"

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
    {path: "/negative-emotions", title: "Negative Emotions", factory: NegativeEmotionsSlide},
    {path: "/opendaw-ideas", title: "openDAW Ideas", factory: OpenDAWIdeasSlide},
    {path: "/opendaw-ambassadors", title: "openDAW Ambassadors", factory: OpenDAWAmbassadorsSlide},
    {path: "/trojan-horse", title: "Trojan Horse", factory: TrojanHorseSlide},
    {path: "/x-reactions", title: "X Reactions", factory: XReactionsSlide},
    {path: "/do-it-anyway", title: "Do It Anyway", factory: DoItAnywaySlide},
    {path: "/opendaw-snapshots", title: "openDAW Snapshots", factory: OpenDAWSnapshotsSlide},
    {path: "/opendaw-today", title: "openDAW Today", factory: OpenDAWTodaySlide},
    {path: "/opendaw-stats", title: "openDAW Stats", factory: OpenDAWStatsSlide},
    {path: "/opendaw-features", title: "openDAW Features", factory: OpenDAWFeaturesSlide},
    {path: "/open-up", title: "Ilir Bajri Open Up", factory: OpenUpSlide},
    {path: "/script-editor", title: "Script Editor", factory: ScriptEditorSlide},
    {path: "/piano-tutorial", title: "Piano Tutorial", factory: PianoTutorialSlide},
    {path: "/lib-jsx", title: "lib-jsx", factory: LibJsxSlide},
    {path: "/lib-box", title: "lib-box", factory: LibBoxSlide},
    {path: "/orange3", title: "orange3", factory: Orange3Slide},
    {path: "/external-gear", title: "External Gear", factory: ExternalGearSlide},
    {path: "/opendaw-sdk", title: "openDAW SDK", factory: OpenDAWSDKSlide},
    {path: "/riffle", title: "Riffle", factory: RiffleSlide},
    {path: "/techno-setup", title: "Techno Setup", factory: TechnoSetupSlide},
    {path: "/ai-coding", title: "AI Coding", factory: AICodingSlide},
    {path: "/demo-time", title: "Demo Time", factory: DemoTimeSlide},
    {path: "/qr", title: "QR", factory: QRCodeSlide}
]