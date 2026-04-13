import css from "./EightBitBoySlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "EightBitBoy")

const BASE = "/8bitboy/"
const SWF = `${BASE}BitboyApp.swf`
const ORIGIN_WIDTH = 150
const ORIGIN_HEIGHT = 57
const SCALE = 5

const BitboyMovie = () => (
    <object type="application/x-shockwave-flash" data={SWF}
            width={String(ORIGIN_WIDTH)} height={String(ORIGIN_HEIGHT)}>
        <param name="movie" value={SWF}/>
        <param name="flashvars" value="config=8bitboy.xml"/>
        <param name="quality" value="low"/>
        <param name="bgcolor" value="#bababa"/>
        <param name="base" value={BASE}/>
        <param name="allowScriptAccess" value="always"/>
    </object>
)

const pixelateRufflePlayer = (host: HTMLElement) => {
    const tryApply = () => {
        const player = host.querySelector("ruffle-player, ruffle-object") as HTMLElement | null
        const shadow = (player as unknown as { shadowRoot: ShadowRoot | null } | null)?.shadowRoot ?? null
        const canvas = shadow?.querySelector("canvas") ?? null
        if (player !== null && canvas !== null) {
            player.style.transform = `scale(${SCALE})`
            player.style.transformOrigin = "top left"
            canvas.style.imageRendering = "pixelated"
            return
        }
        requestAnimationFrame(tryApply)
    }
    requestAnimationFrame(tryApply)
}

export const EightBitBoySlide = () => (
    <Slide eyebrow="8Bitboy · 2005/09" headline="An Amiga MOD player in Flash.">
        <div class={className}>
            <div class="stage" style={{
                width: `${ORIGIN_WIDTH * SCALE}px`,
                height: `${ORIGIN_HEIGHT * SCALE}px`
            }} onConnect={pixelateRufflePlayer}>
                <BitboyMovie/>
            </div>
            <div class="meta">
                <h2>What it does</h2>
                <ul class="bullets">
                    <li>MOD format decoder contributed by <strong>Joa Ebert</strong>.</li>
                    <li>Loads classic Amiga Protracker (1987) MOD files.</li>
                    <li>Mixes 4 channels of 8-bit samples in pure ActionScript.</li>
                    <li>Streams the result through the audio buffer hack.</li>
                    <li>Player is about 50 KB.</li>
                    <li>Tiny mod files: typically <strong>7 to 150 KB</strong> per song.</li>
                </ul>
            </div>
        </div>
    </Slide>
)
