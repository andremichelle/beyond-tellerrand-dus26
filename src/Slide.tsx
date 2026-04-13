import {createElement} from "@opendaw/lib-jsx"
import {JsxValue} from "@opendaw/lib-jsx"

export type SlideProps = {
    eyebrow: string
    headline: string
}

export const Slide = ({eyebrow, headline}: SlideProps, children: ReadonlyArray<JsxValue>) => (
    <section className="slide">
        <header>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{headline}</h1>
        </header>
        <div className="content">
            {children}
        </div>
    </section>
)