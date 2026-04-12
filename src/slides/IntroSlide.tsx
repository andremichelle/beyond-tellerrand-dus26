import {createElement} from "@opendaw/lib-jsx"
import {Slide} from "@/Slide"

export const IntroSlide = () => (
    <Slide eyebrow="beyond tellerrand · DUS26" headline="openDAW — a DAW in your browser.">
        <p>
            A next-gen, fully <strong>web-based</strong> digital audio workstation built with
            <code>TypeScript</code>, <code>WebAudio</code>, and a tiny custom <code>JSX</code> runtime.
        </p>
        <ul className="bullets">
            <li>No installer. No native dependencies. Just a URL.</li>
            <li><strong>Cross-origin isolated</strong>, sample-accurate, multi-threaded.</li>
            <li>Open source — <strong>AGPL v3</strong> with a commercial option.</li>
            <li>Built live on stage at <strong>beyond tellerrand Düsseldorf 2026</strong>.</li>
        </ul>
    </Slide>
)
