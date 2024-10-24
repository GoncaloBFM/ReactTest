import {GraphNode} from "@/types/GraphNode";
import {GraphEdge} from "@/types/GraphEdge";
import {SafeMap} from "@/utils/SafeMap";

export class GraphData {
    private readonly nodes: SafeMap<string, GraphNode>
    private readonly edges: SafeMap<string, GraphEdge>
    constructor(nodes: Array<GraphNode> | SafeMap<string, GraphNode>, edges: Array<GraphEdge> | SafeMap<string, GraphEdge>) {
        if (nodes instanceof Array) {
            this.nodes = new SafeMap(nodes.map(n => [n.id, n]))
        } else {
            this.nodes = nodes
        }

        if (edges instanceof Array) {
            this.edges = new SafeMap(edges.map(e => [e.id, e]))
        } else {
            this.edges = edges
        }
    }

    get nodesList() {
        return Array.from(this.nodes.values())
    }

    get edgesList() {
        return Array.from(this.edges.values())
    }

    get nodesMap() {
        return this.nodes
    }

    get edgesMap() {
        return this.edges
    }
}