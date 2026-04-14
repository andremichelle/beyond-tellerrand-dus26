import {Option, PI_HALF, TAU, Terminator, unitValue, ValueGuide} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {Dragging, Svg} from "@opendaw/lib-dom"
import {KnobParameter} from "./knob-parameter"

const RADIUS = 22
const TRACK_WIDTH = 1.5
const ANGLE_OFFSET = Math.PI / 5
const INDICATOR_MIN = 0.3
const INDICATOR_MAX = 0.6
const INDICATOR_WIDTH = 2.5

export const Knob = ({parameter, terminator}: {
    parameter: KnobParameter
    terminator: Terminator
}): HTMLDivElement => {
    const trackRadius = Math.floor(RADIUS - TRACK_WIDTH * 0.5)
    const angleMin = PI_HALF + ANGLE_OFFSET
    const angleMax = PI_HALF - ANGLE_OFFSET
    const angleRange = TAU - ANGLE_OFFSET * 2
    const angleAnc = angleMin + parameter.anchor * angleRange
    const width = RADIUS * 2
    const height = RADIUS + Math.ceil(Math.cos(ANGLE_OFFSET) * RADIUS)

    const arcPath: SVGPathElement = <path class="value-arc"/>
    const indicatorPath: SVGPathElement = (
        <path class="value-line" stroke-linecap="round" stroke-width={String(INDICATOR_WIDTH)}/>
    )

    const update = (value: unitValue) => {
        const clamped = Math.max(0, Math.min(1, value))
        const angleVal = angleMin + clamped * angleRange
        const lo = Math.min(angleVal, angleAnc)
        const hi = Math.max(angleVal, angleAnc)
        arcPath.setAttribute("d", Svg.pathBuilder()
            .circleSegment(0, 0, trackRadius, lo - 1.0 / trackRadius, hi + 1.0 / trackRadius)
            .get())
        const cos = Math.cos(angleVal) * trackRadius
        const sin = Math.sin(angleVal) * trackRadius
        indicatorPath.setAttribute("d", Svg.pathBuilder()
            .moveTo(cos * INDICATOR_MIN, sin * INDICATOR_MIN)
            .lineTo(cos * INDICATOR_MAX, sin * INDICATOR_MAX)
            .get())
    }

    const valueLabel: HTMLSpanElement = <span class="value">{parameter.getPrintValue()}</span>
    const nameLabel: HTMLSpanElement = <span class="name">{parameter.label}</span>

    const svg: SVGSVGElement = (
        <svg class="knob" viewBox={`0 0 ${width} ${height}`}>
            <g fill="none"
               stroke="currentColor"
               stroke-linecap="butt"
               stroke-width={String(TRACK_WIDTH)}
               transform={`translate(${RADIUS}, ${RADIUS})`}>
                <circle r={String(RADIUS * INDICATOR_MAX * 1.1)} stroke="none" fill="black" class="shadow" cy={String(RADIUS * 0.1)}/>
                <circle r={String(RADIUS * INDICATOR_MAX)} stroke="none" fill="currentColor"/>
                <path class="track" stroke="currentColor" stroke-opacity={1 / 3}
                      d={Svg.pathBuilder()
                          .circleSegment(0, 0, trackRadius, angleMin, angleMax)
                          .get()}/>
                {arcPath}
                {indicatorPath}
            </g>
        </svg>
    )

    const root: HTMLDivElement = (
        <div class="knob-cell">
            {nameLabel}
            {svg}
            {valueLabel}
        </div>
    )

    terminator.own(parameter.subscribe(() => {
        update(parameter.getControlledUnitValue())
        valueLabel.textContent = parameter.getPrintValue()
    }))
    update(parameter.getControlledUnitValue())

    terminator.own(Dragging.attach(svg, (event: PointerEvent) => {
        const startValue = parameter.getUnitValue()
        svg.classList.add("modifying")
        const guide = ValueGuide.create()
        if (event.shiftKey) {guide.disable()} else {guide.enable()}
        guide.begin(startValue)
        guide.ratio(event.altKey ? 0.25 : 1.5)
        let pointer = -event.clientY
        return Option.wrap({
            update: (ev: Dragging.Event): void => {
                if (ev.shiftKey) {guide.disable()} else {guide.enable()}
                guide.ratio(ev.altKey ? 0.25 : 1.5)
                const newPointer = -ev.clientY
                guide.moveBy(newPointer - pointer)
                pointer = newPointer
                parameter.setUnitValue(guide.value())
            },
            approve: () => {
                parameter.setUnitValue(guide.value())
                parameter.mark()
            },
            cancel: () => parameter.setUnitValue(startValue),
            finally: () => svg.classList.remove("modifying")
        })
    }, {pointerLock: true}))

    return root
}
