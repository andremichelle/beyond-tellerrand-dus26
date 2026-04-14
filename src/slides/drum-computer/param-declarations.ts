export type ParamCurve = "linear" | "exp" | "int" | "bool"

export type ParamDeclaration = {
    readonly label: string
    readonly defaultValue: number
    readonly min: number
    readonly max: number
    readonly curve: ParamCurve
    readonly unit: string
}

const HEADER_RE = /^\/\/\s*@param\s+(.+)$/

export const parseParamDeclarations = (source: string): ReadonlyArray<ParamDeclaration> => {
    const result: Array<ParamDeclaration> = []
    for (const line of source.split("\n")) {
        const match = line.match(HEADER_RE)
        if (match === null) {continue}
        const tokens = match[1].trim().split(/\s+/)
        if (tokens.length === 0) {continue}
        const label = tokens[0]
        const second = tokens[1]
        if (second === "true" || second === "false") {
            result.push({
                label,
                defaultValue: second === "true" ? 1 : 0,
                min: 0,
                max: 1,
                curve: "bool",
                unit: ""
            })
            continue
        }
        const defaultValue = parseFloat(tokens[1] ?? "0")
        const min = parseFloat(tokens[2] ?? "0")
        const max = parseFloat(tokens[3] ?? "1")
        const curveToken = tokens[4] ?? "linear"
        const unit = tokens[5] ?? ""
        const curve: ParamCurve = curveToken === "int"
            ? "int"
            : curveToken === "exp"
                ? "exp"
                : "linear"
        result.push({label, defaultValue, min, max, curve, unit})
    }
    return result
}
