import css from "./BasementMXSlide.sass?inline"
import {createElement, replaceChildren} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {FlashMovie} from "@/components/FlashMovie"

const className = Html.adoptStyleSheet(css, "BasementMX")

const BASE = "/basementmx/"
const SWF = `${BASE}main.swf`
const ORIGIN_WIDTH = 599
const ORIGIN_HEIGHT = 350
const SCALE = 1

type Bank = "techno" | "triphop" | "shot"

const BankMovie = ({bank}: { bank: Bank }) => (
    <FlashMovie
        src={SWF}
        width={ORIGIN_WIDTH}
        height={ORIGIN_HEIGHT}
        scale={SCALE}
        base={BASE}
        bgColor="#222121"
        quality="high"
        flashvars={`bank=${bank}`}
    />
)

const Guide = () => (
    <img src={`${BASE}images/guide.jpg`} width={598} height={348} alt="guide"/>
)

const NavButton = ({base, alt, onClick}: { base: string, alt: string, onClick: () => void }) => {
    const img: HTMLImageElement = (
        <img src={`${BASE}images/but_${base}.gif`} width={170} height={23} alt={alt}/>
    )
    return (
        <a href="#"
           onclick={(event: Event) => {
               event.preventDefault()
               onClick()
           }}
           onmouseover={() => { img.src = `${BASE}images/but_${base}_o.gif` }}
           onmouseout={() => { img.src = `${BASE}images/but_${base}.gif` }}>
            {img}
        </a>
    )
}

export const BasementMXSlide = () => {
    const flashHost: HTMLDivElement = (<div className="flash"/>)
    const showBank = (bank: Bank) => replaceChildren(flashHost, <BankMovie bank={bank}/>)
    const showGuide = () => replaceChildren(flashHost, <Guide/>)
    showBank("techno")
    return (
        <Slide eyebrow="Flash 5" headline="Basementmx.">
            <div className={className}>
                <div className="stage">
                    <div className="top">
                        <img src={`${BASE}images/top.gif`} width={597} height={124} alt=""/>
                    </div>
                    {flashHost}
                    <div className="nav">
                        <NavButton base="andreloop" alt="techno" onClick={() => showBank("techno")}/>
                        <NavButton base="davidloop" alt="triphop" onClick={() => showBank("triphop")}/>
                        <NavButton base="shotloop" alt="shot" onClick={() => showBank("shot")}/>
                        <NavButton base="guide" alt="guide" onClick={showGuide}/>
                    </div>
                </div>
                <ul className="bullets">
                    <li>Starts playing all loops at once.</li>
                    <li>Routes the selected loop to the output with <strong>SoundTransform</strong>.</li>
                </ul>
            </div>
        </Slide>
    )
}
