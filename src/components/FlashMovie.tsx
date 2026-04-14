import {createElement} from "@opendaw/lib-jsx"

export type FlashMovieProps = {
    src: string
    width: number
    height: number
    scale?: number
    base?: string
    bgColor?: string
    quality?: "low" | "medium" | "high" | "best"
    flashvars?: string
}

type RufflePlayer = HTMLElement & {
    load: (config: {
        url: string
        base?: string
        parameters?: Record<string, string>
        backgroundColor?: string
        quality?: string
    }) => Promise<void>
    pause?: () => void
    shadowRoot: ShadowRoot | null
}

type RuffleSourceAPI = {
    createPlayer: () => RufflePlayer
}

type RuffleGlobal = {
    newest: () => RuffleSourceAPI | null
}

declare global {
    interface Window {
        RufflePlayer?: RuffleGlobal & Record<string, unknown>
    }
}

const parseFlashvars = (flashvars: string | undefined): Record<string, string> => {
    if (flashvars === undefined) {return {}}
    const result: Record<string, string> = {}
    new URLSearchParams(flashvars).forEach((value, key) => {result[key] = value})
    return result
}

const pixelatePlayer = (player: RufflePlayer, scale: number, shouldStop: () => boolean): void => {
    const tryApply = () => {
        if (shouldStop()) {return}
        const canvas = player.shadowRoot?.querySelector("canvas") ?? null
        if (canvas !== null) {
            player.style.transform = `scale(${scale})`
            player.style.transformOrigin = "top left"
            canvas.style.imageRendering = "pixelated"
            return
        }
        requestAnimationFrame(tryApply)
    }
    requestAnimationFrame(tryApply)
}

export const FlashMovie = ({
    src,
    width,
    height,
    scale = 1,
    base,
    bgColor = "#000000",
    quality = "low",
    flashvars
}: FlashMovieProps) => {
    const onConnect = (host: HTMLElement) => {
        let disconnected = false
        const shouldStop = () => disconnected
        const api = window.RufflePlayer?.newest?.() ?? null
        if (api === null) {
            console.warn("FlashMovie: window.RufflePlayer is not available")
            return
        }
        const player = api.createPlayer()
        player.style.width = `${width}px`
        player.style.height = `${height}px`
        host.appendChild(player)
        const loadPromise = player.load({
            url: src,
            base,
            parameters: parseFlashvars(flashvars),
            backgroundColor: bgColor,
            quality
        })
        loadPromise.then(() => {
            if (disconnected) {
                try {player.pause?.()} catch {/* ignore */}
                player.remove()
            }
        }).catch((reason: unknown) => {
            if (!disconnected) {console.warn("FlashMovie: load failed", reason)}
        })
        if (scale !== 1) {
            pixelatePlayer(player, scale, shouldStop)
        }
        const watch = () => {
            if (disconnected) {return}
            if (!host.isConnected) {
                disconnected = true
                try {player.pause?.()} catch {/* ignore */}
                player.remove()
                return
            }
            requestAnimationFrame(watch)
        }
        requestAnimationFrame(watch)
    }
    return (
        <div class="flash-movie" style={{
            width: `${width * scale}px`,
            height: `${height * scale}px`,
            position: "relative"
        }} onConnect={onConnect}/>
    )
}
