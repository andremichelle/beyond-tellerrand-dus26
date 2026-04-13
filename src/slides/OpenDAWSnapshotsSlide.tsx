import css from "./OpenDAWSnapshotsSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"
import {setKeyIntercept} from "@/keyIntercept"

const className = Html.adoptStyleSheet(css, "OpenDAWSnapshots")

const SNAPSHOTS: ReadonlyArray<string> = [
    "2023-11-21.001.png",
    "2023-11-22.001.png",
    "2023-11-23.001.png",
    "2023-11-24.001.png",
    "2023-11-25.001.png",
    "2023-12-02.001.png",
    "2023-12-03.001.png",
    "2023-12-04.001.png",
    "2023-12-05.001.png",
    "2023-12-06.001.png",
    "2024-02-26.001.png",
    "2024-02-28.001.png",
    "2024-03-04.001.png",
    "2024-03-05.001.png",
    "2024-03-06.001.png",
    "2024-03-09.001.png",
    "2024-03-14.001.png",
    "2024-03-15.001.png",
    "2024-03-21.001.png",
    "2024-03-24.001.png",
    "2024-03-26.001.png",
    "2024-03-27.001.png",
    "2024-05-17.001.webp",
    "2024-05-18.001.webp",
    "2024-07-04.001.webp",
    "2024-09-06.001.png"
]

const dateOf = (file: string): string => file.slice(0, 10)
const srcOf = (file: string): string => `/opendaw/snapshots/${file}`

export const OpenDAWSnapshotsSlide = () => {
    let currentIndex = 0
    const img = <img src={srcOf(SNAPSHOTS[0])} alt={dateOf(SNAPSHOTS[0])}/> as HTMLImageElement
    const meta = <span>{dateOf(SNAPSHOTS[0])}</span> as HTMLSpanElement
    const dots: Array<HTMLButtonElement> = []
    const show = (index: number) => {
        currentIndex = index
        const file = SNAPSHOTS[index]
        img.src = srcOf(file)
        img.alt = dateOf(file)
        meta.textContent = dateOf(file)
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index))
    }
    SNAPSHOTS.forEach((file, index) => {
        dots.push(
            <button
                type="button"
                class={index === 0 ? "active" : undefined}
                title={dateOf(file)}
                onclick={() => show(index)}/> as HTMLButtonElement
        )
    })
    const onConnect = (host: HTMLElement) => {
        setKeyIntercept((event) => {
            if (!host.isConnected) {
                setKeyIntercept(null)
                return false
            }
            if (event.shiftKey) {return false}
            if (event.key === "ArrowRight") {
                if (currentIndex >= SNAPSHOTS.length - 1) {return false}
                event.preventDefault()
                show(currentIndex + 1)
                return true
            }
            if (event.key === "ArrowLeft") {
                if (currentIndex <= 0) {return false}
                event.preventDefault()
                show(currentIndex - 1)
                return true
            }
            return false
        })
    }
    return (
        <Slide eyebrow="openDAW" headline="From first sketch to something real.">
            <div class={className} onConnect={onConnect}>
                <div class="viewer">{img}</div>
                <div class="meta">{meta}</div>
                <div class="dots">{dots}</div>
            </div>
        </Slide>
    )
}
