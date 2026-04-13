import {Circle} from "./solver"

const TAU = Math.PI * 2

export class PulsateRenderer {
    private readonly context: CanvasRenderingContext2D

    constructor(readonly canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")
        if (ctx === null) {throw new Error("no 2d context")}
        this.context = ctx
    }

    render(circles: ReadonlyArray<Circle>): void {
        const width = this.canvas.clientWidth
        const height = this.canvas.clientHeight
        const pixelRatio = devicePixelRatio
        if (this.canvas.width !== width * pixelRatio || this.canvas.height !== height * pixelRatio) {
            this.canvas.width = width * pixelRatio
            this.canvas.height = height * pixelRatio
        }
        const ctx = this.context
        ctx.save()
        ctx.scale(pixelRatio, pixelRatio)
        ctx.clearRect(0, 0, width, height)
        ctx.beginPath()
        for (const circle of circles) {
            if (circle.radius < 0.0) {continue}
            ctx.moveTo(circle.x + circle.radius, circle.y)
            ctx.arc(circle.x, circle.y, circle.radius, 0.0, TAU)
        }
        ctx.lineWidth = pixelRatio
        ctx.strokeStyle = "#ff8c1a"
        ctx.stroke()
        ctx.restore()
    }
}
