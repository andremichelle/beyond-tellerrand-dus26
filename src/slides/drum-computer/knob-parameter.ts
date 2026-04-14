import {Notifier, Subscription, Terminable, Terminator, unitValue, ValueMapping} from "@opendaw/lib-std"
import {Float32Field} from "@opendaw/lib-box"
import {WerkstattParameterBox} from "@opendaw/studio-boxes"
import {Project} from "@opendaw/studio-core"
import {ParamDeclaration} from "./param-declarations"

export interface KnobParameter extends Terminable {
    readonly label: string
    readonly anchor: unitValue

    subscribe(observer: (self: KnobParameter) => void): Subscription

    getControlledUnitValue(): unitValue
    getUnitValue(): unitValue
    setUnitValue(value: unitValue): void
    mark(): void
    getPrintValue(): string
}

const formatUnit = (unit: string): string => unit.length === 0 ? "" : ` ${unit}`

const formatNumeric = (value: number, fractionDigits: number): string => {
    if (!Number.isFinite(value)) {return value < 0 ? "-∞" : "∞"}
    return value.toFixed(fractionDigits)
}

const unitToDeclValue = (u: unitValue, decl: ParamDeclaration): number => {
    const clamped = Math.max(0, Math.min(1, u))
    if (decl.curve === "linear") {return decl.min + clamped * (decl.max - decl.min)}
    if (decl.curve === "int") {return Math.round(decl.min + clamped * (decl.max - decl.min))}
    if (decl.curve === "exp") {
        const lo = Math.max(decl.min, 1e-9)
        return lo * Math.pow(decl.max / lo, clamped)
    }
    return clamped >= 0.5 ? 1 : 0
}

const declValueToUnit = (value: number, decl: ParamDeclaration): unitValue => {
    if (decl.curve === "linear" || decl.curve === "int") {
        return (value - decl.min) / (decl.max - decl.min)
    }
    if (decl.curve === "exp") {
        const lo = Math.max(decl.min, 1e-9)
        return Math.log(value / lo) / Math.log(decl.max / lo)
    }
    return value
}

export class WerkstattKnobParameter implements KnobParameter {
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
    get anchor(): unitValue {return 0.0}

    subscribe(observer: (self: KnobParameter) => void): Subscription {
        return this.#notifier.subscribe(observer)
    }

    getControlledUnitValue(): unitValue {
        return Math.max(0, Math.min(1, declValueToUnit(this.#box.value.getValue(), this.#decl)))
    }

    getUnitValue(): unitValue {return this.getControlledUnitValue()}

    setUnitValue(value: unitValue): void {
        this.#project.editing.modify(() => {
            this.#box.value.setValue(unitToDeclValue(value, this.#decl))
        }, false)
    }

    mark(): void {this.#project.editing.mark()}

    getPrintValue(): string {
        const value = this.#box.value.getValue()
        if (this.#decl.curve === "int") {return String(Math.round(value)) + formatUnit(this.#decl.unit)}
        if (this.#decl.curve === "bool") {return value >= 0.5 ? "on" : "off"}
        const digits = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2
        return formatNumeric(value, digits) + formatUnit(this.#decl.unit)
    }

    terminate(): void {this.#terminator.terminate()}
}

export type FieldKnobConfig = {
    readonly label: string
    readonly unit: string
    readonly mapping: ValueMapping<number>
    readonly fractionDigits: number
    readonly anchor?: unitValue
}

export class FieldKnobParameter implements KnobParameter {
    readonly #project: Project
    readonly #field: Float32Field<any>
    readonly #config: FieldKnobConfig
    readonly #terminator: Terminator
    readonly #notifier: Notifier<KnobParameter>

    constructor(project: Project, field: Float32Field<any>, config: FieldKnobConfig) {
        this.#project = project
        this.#field = field
        this.#config = config
        this.#terminator = new Terminator()
        this.#notifier = this.#terminator.own(new Notifier<KnobParameter>())
        this.#terminator.own(field.catchupAndSubscribe(() => this.#notifier.notify(this)))
    }

    get label(): string {return this.#config.label}
    get anchor(): unitValue {return this.#config.anchor ?? 0.0}

    subscribe(observer: (self: KnobParameter) => void): Subscription {
        return this.#notifier.subscribe(observer)
    }

    getControlledUnitValue(): unitValue {
        return Math.max(0, Math.min(1, this.#config.mapping.x(this.#field.getValue())))
    }

    getUnitValue(): unitValue {return this.getControlledUnitValue()}

    setUnitValue(value: unitValue): void {
        this.#project.editing.modify(() => {
            this.#field.setValue(this.#config.mapping.y(Math.max(0, Math.min(1, value))))
        }, false)
    }

    mark(): void {this.#project.editing.mark()}

    getPrintValue(): string {
        const raw = this.#field.getValue()
        return formatNumeric(raw, this.#config.fractionDigits) + formatUnit(this.#config.unit)
    }

    terminate(): void {this.#terminator.terminate()}
}
