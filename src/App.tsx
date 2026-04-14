import {Terminator} from "@opendaw/lib-std"
import {createElement, Frag, LocalLink, RouteLocation, Router} from "@opendaw/lib-jsx"
import {SLIDES} from "@/index"
import {runKeyIntercept, setPendingNavDirection} from "@/keyIntercept"

export const App = () => {
    const terminator = new Terminator()
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {return}
        const target = event.target as HTMLElement | null
        if (target?.matches("input, textarea, [contenteditable='true']")) {return}
        if (runKeyIntercept(event)) {return}
        const location = RouteLocation.get()
        const index = SLIDES.findIndex(slide => slide.path === location.path)
        const current = index < 0 ? 0 : index
        const delta = event.key === "ArrowRight" ? 1 : -1
        const next = (current + delta + SLIDES.length) % SLIDES.length
        if (next !== current) {
            event.preventDefault()
            setPendingNavDirection(delta > 0 ? "forward" : "backward")
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
                        {SLIDES.map(({path}, index) => (
                            <LocalLink href={path}>{index === 0 ? "Intro" : index}</LocalLink>
                        ))}
                    </Frag>
                </div>
                <div className="controls">
                    {(() => {
                        let startedAt = Date.now()
                        const format = (ms: number): string => {
                            const totalSeconds = Math.floor(ms / 1000)
                            const minutes = Math.floor(totalSeconds / 60)
                            const seconds = totalSeconds % 60
                            return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
                        }
                        const timer: HTMLButtonElement = (
                            <button
                                type="button"
                                className="timer"
                                title="Click to reset"
                                onclick={() => {
                                    startedAt = Date.now()
                                    timer.textContent = format(0)
                                }}>{format(0)}</button>
                        )
                        const tick = () => {
                            if (!timer.isConnected) {return}
                            timer.textContent = format(Date.now() - startedAt)
                            window.setTimeout(tick, 1000)
                        }
                        window.setTimeout(tick, 1000)
                        return timer
                    })()}
                    <button
                        type="button"
                        className="fullscreen"
                        title="Toggle fullscreen"
                        onclick={() => {
                            if (document.fullscreenElement) {
                                document.exitFullscreen().finally()
                            } else {
                                document.documentElement.requestFullscreen().finally()
                            }
                        }}>⛶
                    </button>
                </div>
            </nav>
        </div>
    )
}