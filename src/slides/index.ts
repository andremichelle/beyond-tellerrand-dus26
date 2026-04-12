import {PageFactory} from "@opendaw/lib-jsx"
import {IntroSlide} from "@/slides/IntroSlide"
import {DemoSlide} from "@/slides/DemoSlide"

export type SlideService = void

export type SlideEntry = {
    path: string
    title: string
    factory: PageFactory<SlideService>
}

export const SLIDES: ReadonlyArray<SlideEntry> = [
    {path: "/", title: "Intro", factory: IntroSlide},
    {path: "/demo", title: "Demo", factory: DemoSlide}
]
