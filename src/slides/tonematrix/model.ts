export class Pattern {
    readonly #data = new Uint32Array(16)

    serialize(): string {
        const parts: Array<string> = []
        for (let i = 0; i < 16; i++) {
            parts.push(this.#data[i].toString(32))
        }
        return parts.join(".")
    }

    deserialize(code: string): void {
        try {
            code.split(".")
                .map(c => parseInt(c, 32))
                .forEach((value, index) => this.#data[index] = value)
        } catch {/* ignore */}
    }

    setStep(x: number, y: number, value: boolean): void {
        if (value) {
            this.#data[y] |= 1 << x
        } else {
            this.#data[y] &= ~(1 << x)
        }
    }

    getStep(x: number, y: number): boolean {
        return (this.#data[y] & (1 << x)) !== 0
    }

    clear(): void {
        this.#data.fill(0)
    }
}

export class Model {
    readonly pattern: Pattern = new Pattern()
    stepIndex: number = 0
}
