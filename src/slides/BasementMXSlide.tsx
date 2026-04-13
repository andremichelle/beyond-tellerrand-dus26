import css from "./BasementMXSlide.sass?inline"
import {createElement, replaceChildren} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "BasementMX")

const BASE = "/basementmx/"

type Bank = "techno" | "triphop" | "shot"

const param = (name: string, value: string) =>
    createElement("param", {name, value})

const FlashMovie = ({bank}: { bank: Bank }) => (
    <object type="application/x-shockwave-flash" data={`${BASE}main.swf`} width="599" height="350">
        {param("movie", `${BASE}main.swf`)}
        {param("flashvars", `bank=${bank}`)}
        {param("quality", "high")}
        {param("bgcolor", "#222121")}
        {param("base", BASE)}
        {param("allowScriptAccess", "always")}
    </object>
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
    const showBank = (bank: Bank) => replaceChildren(flashHost, <FlashMovie bank={bank}/>)
    const showGuide = () => replaceChildren(flashHost, <Guide/>)
    showBank("techno")
    return (
        <Slide eyebrow="Time machine · 2001" headline="Basementmx, Flash turntables.">
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
            </div>
        </Slide>
    )
}
