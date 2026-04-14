import {Notifier, Subscription, Terminator, unitValue} from "@opendaw/lib-std"
import {WerkstattParameterBox} from "@opendaw/studio-boxes"
import {Project} from "@opendaw/studio-core"
import {ParamDeclaration} from "./param-declarations"

const unitToValue = (u: unitValue, decl: ParamDeclaration): number => {
    const clamped = Math.max(0, Math.min(1, u))
    if (decl.curve === "linear") {return decl.min + clamped * (decl.max - decl.min)}
    if (decl.curve === "int") {return Math.round(decl.min + clamped * (decl.max - decl.min))}
    if (decl.curve === "exp") {
        const lo = Math.max(decl.min, 1e-9)
        return lo * Math.pow(decl.max / lo, clamped)
    }
    return clamped >= 0.5 ? 1 : 0
}

const valueToUnit = (value: number, decl: ParamDeclaration): unitValue => {
    if (decl.curve === "linear" || decl.curve === "int") {
        return (value - decl.min) / (decl.max - decl.min)
    }
    if (decl.curve === "exp") {
        const lo = Math.max(decl.min, 1e-9)
        return Math.log(value / lo) / Math.log(decl.max / lo)
    }
    return value
}

export class KnobParameter {
    readonly #project: Project
    readonly #box: WerkstattParameterBox
    readonly #decl: ParamDeclaration
    readonly #terminator: Terminator
    readonly #notifier: Notifier<KnobParameter>

    constructor(project: Project, box: WerkstattParameterBox, decl: ParamDeclaration) {
        this.#project = project
        this.#box = box
        this.#decl = decl
        this.#terminator = new Terminator()
        this.#notifier = this.#terminator.own(new Notifier<KnobParameter>())
        this.#terminator.own(box.value.catchupAndSubscribe(() => this.#notifier.notify(this)))
    }

    get label(): string {return this.#decl.label}
    get unit(): string {return this.#decl.unit}
    get anchor(): unitValue {return 0.0}

    getValue(): number {return this.#box.value.getValue()}

    getControlledUnitValue(): unitValue {
        return Math.max(0, Math.min(1, valueToUnit(this.#box.value.getValue(), this.#decl)))
    }

    getUnitValue(): unitValue {return this.getControlledUnitValue()}

    setUnitValue(value: unitValue): void {
        this.#project.editing.modify(() => {
            this.#box.value.setValue(unitToValue(value, this.#decl))
        }, false)
    }

    mark(): void {this.#project.editing.mark()}

    subscribe(observer: (self: KnobParameter) => void): Subscription {
        return this.#notifier.subscribe(observer)
    }

    getPrintValue(): string {
        const value = this.#box.value.getValue()
        if (this.#decl.curve === "int") {return String(Math.round(value)) + (this.#unit(this.#decl))}
        if (this.#decl.curve === "bool") {return value >= 0.5 ? "on" : "off"}
        const digits = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2
        return value.toFixed(digits) + this.#unit(this.#decl)
    }

    #unit(decl: ParamDeclaration): string {return decl.unit.length === 0 ? "" : ` ${decl.unit}`}

    terminate(): void {this.#terminator.terminate()}
}
