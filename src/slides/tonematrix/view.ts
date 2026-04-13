import {Model} from "./model"

const fillArray = <T>(n: number, factory: (index: number) => T): T[] => {
    const array: T[] = []
    for (let i = 0; i < n; i++) {array[i] = factory(i)}
    return array
}

const create2dContext = (size: number): CanvasRenderingContext2D => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = size
    const ctx = canvas.getContext("2d")
    if (ctx === null) {throw new Error("no 2d context")}
    return ctx
}

const GRID = 16
const GAP = 1
const INSET = 2

const createStepTexture = (tile: number, outline: string, inline: string): HTMLCanvasElement => {
    const texture = create2dContext(tile)
    const size = tile - GAP
    const outerRadius = Math.max(0, Math.round(tile / 6))
    const innerRadius = Math.max(0, outerRadius - INSET)
    texture.save()
    texture.fillStyle = outline
    texture.beginPath()
    texture.roundRect(0, 0, size, size, outerRadius)
    texture.fill()
    texture.fillStyle = inline
    texture.beginPath()
    texture.roundRect(INSET, INSET, size - INSET * 2, size - INSET * 2, innerRadius)
    texture.fill()
    texture.restore()
    return texture.canvas
}

export class View {
    readonly #model: Model
    readonly #canvas: HTMLCanvasElement
    readonly #graphics: CanvasRenderingContext2D
    readonly #tile: number
    readonly #size: number
    readonly #stepTextureOn: HTMLCanvasElement
    readonly #stepTextureOff: HTMLCanvasElement
    readonly #wavesData: ImageData = new ImageData(16, 16)
    readonly #waves = create2dContext(16)
    readonly #fluidMaps: Float32Array[][] = [
        fillArray(16, () => new Float32Array(16)),
        fillArray(16, () => new Float32Array(16))
    ]

    #fluidMapIndex: number = 0
    #stepIndex: number = -1
    #running: boolean = true
    #drawValue: boolean = false

    readonly #onPointer = (event: MouseEvent | TouchEvent) => {
        event.preventDefault()
        if (event.type === "mousemove" && (event as MouseEvent).buttons === 0) {return}
        const rect = this.#canvas.getBoundingClientRect()
        let clientX: number
        let clientY: number
        const touches = (event as TouchEvent).targetTouches
        if (touches !== undefined && touches.length > 0) {
            const touch = touches.item(0)!
            clientX = touch.clientX
            clientY = touch.clientY
        } else if (event instanceof MouseEvent) {
            clientX = event.clientX
            clientY = event.clientY
        } else {
            return
        }
        const scale = this.#canvas.width / rect.width
        const x = Math.floor((clientX - rect.left) * scale / this.#tile)
        const y = Math.floor((clientY - rect.top) * scale / this.#tile)
        if (x < 0 || x >= GRID || y < 0 || y >= GRID) {return}
        if (event.type === "mousedown" || event.type === "touchstart") {
            this.#drawValue = !this.#model.pattern.getStep(x, y)
        }
        this.#setStep(x, y, this.#drawValue)
    }

    constructor(model: Model, canvas: HTMLCanvasElement, tile: number = 36) {
        this.#model = model
        this.#canvas = canvas
        this.#tile = tile
        this.#size = tile * GRID
        this.#canvas.width = this.#size
        this.#canvas.height = this.#size
        this.#canvas.style.width = `${this.#size}px`
        this.#canvas.style.height = `${this.#size}px`
        this.#stepTextureOn = createStepTexture(tile, "#FFFFFF", "#DADADA")
        this.#stepTextureOff = createStepTexture(tile, "#404040", "#1A1A1A")
        const ctx = this.#canvas.getContext("2d")
        if (ctx === null) {throw new Error("no 2d context")}
        this.#graphics = ctx
        this.#canvas.addEventListener("mousedown", this.#onPointer)
        this.#canvas.addEventListener("touchstart", this.#onPointer)
        this.#canvas.addEventListener("mousemove", this.#onPointer)
        this.#canvas.addEventListener("touchmove", this.#onPointer)
        requestAnimationFrame(this.#processAnimationFrame)
    }

    terminate(): void {
        this.#running = false
        this.#canvas.removeEventListener("mousedown", this.#onPointer)
        this.#canvas.removeEventListener("touchstart", this.#onPointer)
        this.#canvas.removeEventListener("mousemove", this.#onPointer)
        this.#canvas.removeEventListener("touchmove", this.#onPointer)
    }

    #setStep(x: number, y: number, value: boolean): void {
        this.#model.pattern.setStep(x, y, value)
        if (value) {this.#touchFluid(x, y)}
    }

    #touchFluid(x: number, y: number): void {
        this.#fluidMaps[0][y][x] = -1.0
        this.#fluidMaps[1][y][x] = -1.0
    }

    readonly #processAnimationFrame = () => {
        if (!this.#running) {return}
        this.#touchActives()
        this.#processFluid()
        this.#graphics.imageSmoothingEnabled = false
        this.#graphics.clearRect(0, 0, this.#size, this.#size)
        this.#graphics.globalCompositeOperation = "source-over"
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                const texture = this.#model.pattern.getStep(x, y) ? this.#stepTextureOn : this.#stepTextureOff
                this.#graphics.drawImage(texture, x * this.#tile, y * this.#tile)
            }
        }
        this.#graphics.save()
        this.#graphics.globalCompositeOperation = "lighter"
        this.#graphics.filter = "blur(8px)"
        this.#graphics.drawImage(this.#waves.canvas, 0, 0, this.#size, this.#size)
        this.#graphics.restore()
        requestAnimationFrame(this.#processAnimationFrame)
    }

    #touchActives(): void {
        if (this.#stepIndex !== this.#model.stepIndex) {
            this.#stepIndex = this.#model.stepIndex
            for (let y = 0; y < 16; ++y) {
                if (this.#model.pattern.getStep(this.#stepIndex, y)) {
                    this.#touchFluid(this.#stepIndex, y)
                }
            }
        }
    }

    #processFluid(): void {
        const fma = this.#fluidMaps[this.#fluidMapIndex]
        const fmb = this.#fluidMaps[1 - this.#fluidMapIndex]
        const data = this.#wavesData.data
        const damp = 0.86
        for (let y = 0; y < 16; ++y) {
            const f0 = fma[y - 1]
            const f1 = fma[y]
            const f2 = fma[y + 1]
            for (let x = 0; x < 16; ++x) {
                let amp = 0.0
                if (x > 0) {amp += f1[x - 1]}
                if (y > 0) {amp += f0[x]}
                if (x < 15) {amp += f1[x + 1]}
                if (y < 15) {amp += f2[x]}
                amp = (amp * 0.25 - fmb[y][x]) * damp
                if (amp < -1.0) {amp = -1.0}
                else if (amp > 1.0) {amp = 1.0}
                fmb[y][x] = amp
                const gray = Math.max(0, Math.min(255, (255 * amp ** 0.75) | 0))
                const index = ((y << 4) | x) << 2
                data[index] = gray
                data[index + 1] = gray
                data[index + 2] = gray
                data[index + 3] = 255
            }
        }
        this.#fluidMapIndex = 1 - this.#fluidMapIndex
        this.#waves.putImageData(this.#wavesData, 0, 0)
    }
}
