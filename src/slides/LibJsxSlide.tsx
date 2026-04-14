import css from "./LibJsxSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "LibJsx")

const CODE_SNIPPET: string = [
    `<span class="k">const</span> <span class="fn">Profile</span> = ({url}: {url: <span class="t">string</span>}) =&gt; (`,
    `  &lt;<span class="tag">Await</span>`,
    `    <span class="fn">factory</span>={() =&gt; <span class="fn">fetch</span>(url).<span class="fn">then</span>(r =&gt; r.<span class="fn">json</span>())}`,
    `    <span class="fn">loading</span>={() =&gt; &lt;<span class="tag">div</span>&gt;Loading…&lt;/<span class="tag">div</span>&gt;}`,
    `    <span class="fn">success</span>={({avatar, title, body}) =&gt; (`,
    `      &lt;<span class="tag">div</span>&gt;`,
    `        &lt;<span class="tag">img</span> <span class="fn">src</span>={avatar}/&gt;`,
    `        &lt;<span class="tag">h2</span>&gt;{title}&lt;/<span class="tag">h2</span>&gt;`,
    `        &lt;<span class="tag">p</span>&gt;{body}&lt;/<span class="tag">p</span>&gt;`,
    `      &lt;/<span class="tag">div</span>&gt;`,
    `    )}`,
    `    <span class="fn">failure</span>={({reason, retry}) =&gt; (`,
    `      &lt;<span class="tag">div</span>&gt;`,
    `        Failed: {<span class="fn">String</span>(reason)}`,
    `        &lt;<span class="tag">button</span> <span class="fn">onclick</span>={retry}&gt;Retry&lt;/<span class="tag">button</span>&gt;`,
    `      &lt;/<span class="tag">div</span>&gt;`,
    `    )}`,
    `  /&gt;`,
    `)`
].join("\n")

const renderCodeBlock = (): HTMLPreElement => {
    const pre: HTMLPreElement = <pre class="code"/>
    pre.innerHTML = CODE_SNIPPET
    return pre
}

export const LibJsxSlide = () => (
    <Slide eyebrow="lib-jsx" headline="React without being React.">
        <div class={className}>
            <div class="react-ban">
                <img src="/images/react-icon.svg" alt="No React"/>
            </div>
            <ul class="bullets">
                <li><strong>LIB-JSX</strong> is developed for performance.</li>
                <li>Utilizes <strong>JavaScript XML</strong></li>
                <li>Full control over html updates.</li>
                <li>Mix HTML and TypeScript.</li>
                <li>Create reusable components.</li>
                <li>No virtual DOM.</li>
                <li>Around <strong>2 - 8 KB</strong> gzipped in production.</li>
            </ul>
            {renderCodeBlock()}
        </div>
    </Slide>
)
