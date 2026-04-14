import css from "./LibJsxSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "LibJsx")

export const LibJsxSlide = () => (
    <Slide eyebrow="lib-jsx" headline="React without being React.">
        <div class={className}>
            <div class="react-ban">
                <img src="/images/react-icon.svg" alt="No React"/>
            </div>
            <ul class="bullets">
                <li><strong>LIB-JSX</strong> is developed for performance.</li>
                <li>Full control over html updates.</li>
                <li>Mix HTML and TypeScript.</li>
                <li>Create reusable components.</li>
                <li>No virtual DOM.</li>
                <li>Around <strong>6 KB</strong> gzipped in production.</li>
            </ul>
        </div>
    </Slide>
)
