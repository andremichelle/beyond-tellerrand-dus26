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

const pixelateRufflePlayer = (host: HTMLElement, scale: number) => {
    const tryApply = () => {
        const player = host.querySelector("ruffle-player, ruffle-object") as HTMLElement | null
        const shadow = (player as unknown as { shadowRoot: ShadowRoot | null } | null)?.shadowRoot ?? null
        const canvas = shadow?.querySelector("canvas") ?? null
        if (player !== null && canvas !== null) {
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
    const onConnect = scale === 1
        ? undefined
        : (host: HTMLElement) => pixelateRufflePlayer(host, scale)
    return (
        <div class="flash-movie" style={{
            width: `${width * scale}px`,
            height: `${height * scale}px`,
            position: "relative"
        }} onConnect={onConnect}>
            <object type="application/x-shockwave-flash" data={src}
                    width={String(width)} height={String(height)}>
                <param name="movie" value={src}/>
                {flashvars !== undefined && <param name="flashvars" value={flashvars}/>}
                <param name="quality" value={quality}/>
                <param name="bgcolor" value={bgColor}/>
                {base !== undefined && <param name="base" value={base}/>}
                <param name="allowScriptAccess" value="always"/>
            </object>
        </div>
    )
}
