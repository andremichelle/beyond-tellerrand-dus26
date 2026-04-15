import css from "./LibBoxSlide.sass?inline"
import {isUndefined, Terminator, unitValue, UUID} from "@opendaw/lib-std"
import {Await, createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Promises} from "@opendaw/lib-runtime"
import {ProjectSkeleton} from "@opendaw/studio-adapters"
import {RootBox} from "@opendaw/studio-boxes"
import ForceGraph from "force-graph"
import * as d3 from "d3-force"
import {SimulationNodeDatum} from "d3-force"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "LibBox")

const PROJECT_URL = "/opendaw/projects/orange3.od"

type GraphNode = {
    id: string
    label?: string
    root?: boolean
    fx?: number
    fy?: number
} & SimulationNodeDatum

type GraphEdge = { source: string; target: string }

type GraphData = { nodes: Array<GraphNode>; edges: Array<GraphEdge> }

const stringToUnit = (value: string): unitValue =>
    Array.from(value).reduce((h, char) => (h * 31 + char.charCodeAt(0)) >>> 0, 0) / 0xffffffff

const stripBoxSuffix = (label?: string) =>
    label?.endsWith("Box") ? label.slice(0, -3) : label

const buildGraphData = (skeleton: ProjectSkeleton): GraphData => {
    const boxes = skeleton.boxGraph.boxes()
    return {
        nodes: boxes.map(box => ({
            id: UUID.toString(box.address.uuid),
            label: stripBoxSuffix(box.name),
            root: box instanceof RootBox
        })),
        edges: boxes.flatMap(box => box.outgoingEdges().map(([pointer, address]) => ({
            source: UUID.toString(pointer.box.address.uuid),
            target: UUID.toString(address.uuid)
        })))
    }
}

const createGraphPanel = (container: HTMLElement, data: GraphData) => {
    const dark = true
    let hovered: GraphNode | null = null

    const graph = new ForceGraph<GraphNode, GraphEdge>(container)
        .graphData({nodes: data.nodes, links: data.edges})
        .backgroundColor("#0e0f12")
        .nodeId("id")
        .linkSource("source")
        .linkTarget("target")
        .nodeRelSize(6)
        .enableNodeDrag(true)
        .autoPauseRedraw(false)
        .linkColor(() => "rgba(255,255,255,0.25)")
        .linkWidth(1)
        .nodeVal(({root}) => root === true ? 48 : 3)
        .nodeColor((n) => {
            const hue = stringToUnit(n.label ?? "")
            return `hsl(${hue * 360}, 75%, 50%)`
        })
        .nodeCanvasObjectMode(() => "after")
        .nodeCanvasObject(() => {/* labels drawn in onRenderFramePost */})
        .onNodeHover((node) => {hovered = (node as GraphNode | null) ?? null})

    graph.onRenderFramePost((ctx: CanvasRenderingContext2D) => {
        const zoom = graph.zoom()
        const threshold = 1.2

        const drawPill = (x: number, y: number, text: string) => {
            const padX = 6
            const padY = 3
            const tw = ctx.measureText(text).width
            const w = tw + padX * 2
            const h = 16 + padY * 2
            const rx = 6
            ctx.beginPath()
            ctx.moveTo(x - w / 2 + rx, y - h / 2)
            ctx.lineTo(x + w / 2 - rx, y - h / 2)
            ctx.quadraticCurveTo(x + w / 2, y - h / 2, x + w / 2, y - h / 2 + rx)
            ctx.lineTo(x + w / 2, y + h / 2 - rx)
            ctx.quadraticCurveTo(x + w / 2, y + h / 2, x + w / 2 - rx, y + h / 2)
            ctx.lineTo(x - w / 2 + rx, y + h / 2)
            ctx.quadraticCurveTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - rx)
            ctx.lineTo(x - w / 2, y - h / 2 + rx)
            ctx.quadraticCurveTo(x - w / 2, y - h / 2, x - w / 2 + rx, y - h / 2)
            ctx.closePath()
            ctx.fillStyle = dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.8)"
            ctx.fill()
            ctx.strokeStyle = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"
            ctx.stroke()
            ctx.fillStyle = dark ? "#ffffff" : "#000000"
            ctx.fillText(text, x, y)
        }

        ctx.save()
        const fontSize = 12 / zoom
        ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "#ffffff"

        const g = graph.graphData() as {nodes: Array<GraphNode>}

        if (zoom >= threshold) {
            for (const node of g.nodes) {
                if (isUndefined(node.label) || isUndefined(node.x) || isUndefined(node.y)) {continue}
                ctx.fillText(node.label, node.x, node.y)
            }
        }
        if (hovered !== null && typeof hovered.x === "number" && typeof hovered.y === "number") {
            drawPill(hovered.x, hovered.y - 18 / zoom, hovered.label ?? hovered.id)
        }
        ctx.restore()
    })

    graph
        .d3Force("charge", d3.forceManyBody().strength(-150))
        .d3Force("link", d3.forceLink<GraphNode, GraphEdge>()
            .id((n) => n.id)
            .distance(70)
            .strength(0.8)
        )
        .d3Force("center", d3.forceCenter(0, 0))

    const applySize = () => {
        const rect = container.getBoundingClientRect()
        const layoutWidth = container.offsetWidth
        const layoutHeight = container.offsetHeight
        if (layoutWidth === 0 || layoutHeight === 0) {return}
        const scaleX = rect.width / layoutWidth
        const scaleY = rect.height / layoutHeight
        graph.width(rect.width).height(rect.height)
        const canvasEl = container.querySelector("canvas")
        if (canvasEl !== null) {
            canvasEl.style.transformOrigin = "top left"
            canvasEl.style.transform = `scale(${1 / scaleX}, ${1 / scaleY})`
        }
    }
    const resizeObserver = new ResizeObserver(applySize)
    resizeObserver.observe(container)
    applySize()

    return {
        resize(): void {applySize()},
        terminate(): void {
            try {resizeObserver.disconnect()} catch {/* ignore */}
            try {graph.graphData({nodes: [], links: []})} catch {/* ignore */}
            graph._destructor()
        }
    }
}

const loadProjectSkeleton = async (): Promise<ProjectSkeleton> => {
    const response = await fetch(PROJECT_URL)
    if (!response.ok) {throw new Error(`Failed to load ${PROJECT_URL}: ${response.status}`)}
    const arrayBuffer = await response.arrayBuffer()
    return ProjectSkeleton.decode(arrayBuffer)
}

const GraphPanel = ({skeleton, terminator}: {skeleton: ProjectSkeleton, terminator: Terminator}) => {
    const wrapper: HTMLDivElement = <div class="wrapper"/>
    const data = buildGraphData(skeleton)
    requestAnimationFrame(() => {
        const controller = createGraphPanel(wrapper, data)
        terminator.own({terminate: () => controller.terminate()})
        terminator.own(Html.watchResize(wrapper, () => controller.resize()))
    })
    return wrapper
}

export const LibBoxSlide = () => {
    const terminator = new Terminator()
    const onConnect = (host: HTMLElement) => {
        const watch = () => {
            if (!host.isConnected) {
                terminator.terminate()
                return
            }
            requestAnimationFrame(watch)
        }
        requestAnimationFrame(watch)
    }
    return (
        <Slide eyebrow="lib-box" headline="A graph of boxes.">
            <div class={className} onConnect={onConnect}>
                <Await
                    factory={() => Promises.makeAbortable(terminator, loadProjectSkeleton())}
                    loading={() => <div class="wrapper"><div class="status">Loading orange3.od…</div></div>}
                    success={(skeleton: ProjectSkeleton) => <GraphPanel skeleton={skeleton} terminator={terminator}/>}
                    failure={({reason}) => (
                        <div class="wrapper">
                            <div class="status">Failed to load: {String(reason)}</div>
                        </div>
                    )}
                />
                <ul class="bullets">
                    <li><strong>lib-box</strong> graph data structure.</li>
                    <li>Schema driven.</li>
                    <li>Source code generator.</li>
                    <li>Easy to extend.</li>
                    <li>Pointers.</li>
                </ul>
            </div>
        </Slide>
    )
}
