import css from "./LibJsxSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "LibJsx")

const CODE_SNIPPET: string = [
    `<span class="k">const</span> <span class="fn">Counter</span> = ({title}: {title: <span class="t">string</span>}) =&gt; {`,
    `  <span class="k">const</span> value: <span class="t">HTMLDivElement</span> = &lt;<span class="tag">div</span>&gt;0&lt;/<span class="tag">div</span>&gt;`,
    `  <span class="k">return</span> (`,
    `    &lt;<span class="tag">div</span> <span class="fn">onInit</span>={() =&gt; {`,
    `      <span class="k">let</span> count = <span class="n">0</span>`,
    `      <span class="fn">setInterval</span>(() =&gt; {`,
    `        value.textContent = <span class="fn">String</span>(++count)`,
    `      }, <span class="n">1000</span>)`,
    `    }}&gt;`,
    `      &lt;<span class="tag">h2</span>&gt;{title}&lt;/<span class="tag">h2</span>&gt;`,
    `      {value}`,
    `    &lt;/<span class="tag">div</span>&gt;`,
    `  )`,
    `}`
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
                <li>Around <strong>6 KB</strong> gzipped in production.</li>
            </ul>
            {renderCodeBlock()}
        </div>
    </Slide>
)
