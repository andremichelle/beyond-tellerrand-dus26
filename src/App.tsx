import {Terminator} from "@opendaw/lib-std"
import {createElement, Frag, LocalLink, Router, RouteLocation} from "@opendaw/lib-jsx"
import {SLIDES} from "@/slides"

export const App = () => {
    const terminator = new Terminator()
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {return}
        const target = event.target as HTMLElement | null
        if (target?.matches("input, textarea, [contenteditable='true']")) {return}
        const location = RouteLocation.get()
        const index = SLIDES.findIndex(slide => slide.path === location.path)
        const current = index < 0 ? 0 : index
        const delta = event.key === "ArrowRight" ? 1 : -1
        const next = (current + delta + SLIDES.length) % SLIDES.length
        if (next !== current) {
            event.preventDefault()
            location.navigateTo(SLIDES[next].path)
        }
    }
    window.addEventListener("keydown", onKeyDown)
    terminator.own({terminate: () => window.removeEventListener("keydown", onKeyDown)})
    return (
        <div className="app">
            <Router<void>
                runtime={terminator}
                service={undefined as void}
                fallback={() => (
                    <section className="slide">
                        <header>
                            <span className="eyebrow">404</span>
                            <h1>Slide not found</h1>
                        </header>
                        <div className="content">
                            <p>Try one of the slides below.</p>
                        </div>
                    </section>
                )}
                routes={SLIDES.map(({path, factory}) => ({path, factory}))}
            />
            <nav className="nav">
                <div className="pages">
                    <Frag>
                        {SLIDES.map(({path, title}) => (
                            <LocalLink href={path}>{title}</LocalLink>
                        ))}
                    </Frag>
                </div>
                <div className="step">
                    <span>{`${SLIDES.length} slides`}</span>
                </div>
            </nav>
        </div>
    )
}
