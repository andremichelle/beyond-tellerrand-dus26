import {Terminator} from "@opendaw/lib-std"
import {createElement, Frag, LocalLink, Router} from "@opendaw/lib-jsx"
import {SLIDES} from "@/slides"

export const App = () => {
    const terminator = new Terminator()
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
                <div className="brand">
                    <span className="dot"/>
                    <span>openDAW · beyond tellerrand DUS26</span>
                </div>
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
