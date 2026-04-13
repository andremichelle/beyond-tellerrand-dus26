import css from "./EightBitBoySlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {FlashMovie} from "@/components/FlashMovie"

const className = Html.adoptStyleSheet(css, "EightBitBoy")

const BASE = "/8bitboy/"

export const EightBitBoySlide = () => (
    <Slide eyebrow="8Bitboy · 2005/09" headline="An Amiga MOD player in Flash.">
        <div class={className}>
            <div class="stage">
                <FlashMovie
                    src={`${BASE}BitboyApp.swf`}
                    width={150}
                    height={57}
                    scale={5}
                    base={BASE}
                    bgColor="#bababa"
                    flashvars="config=8bitboy.xml"
                />
            </div>
            <div class="meta">
                <h2>What it does</h2>
                <ul class="bullets">
                    <li>MOD format decoder by <strong>Joa Ebert</strong>.</li>
                    <li>Design by Andre Stubbe.</li>
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