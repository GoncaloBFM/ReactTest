import {GraphNode} from "@/types/GraphNode";
import {GraphEdge} from "@/types/GraphEdge";
import {SafeMap} from "@/utils/SafeMap";
import {bifurcateBy} from "@/utils/array";
import {CompoundNode} from "@/types/CompoundNode";

export class GraphData {
    readonly nodesMap: SafeMap<string, GraphNode>
    readonly edgesMap: SafeMap<string, GraphEdge>

    constructor(nodes: Array<GraphNode> | SafeMap<string, GraphNode>, edges: Array<GraphEdge> | SafeMap<string, GraphEdge>) {
        if (nodes instanceof Array) {
            this.nodesMap = new SafeMap(nodes.map(n => [n.id, n]))
        } else {
            this.nodesMap = nodes
        }

        if (edges instanceof Array) {
            this.edgesMap = new SafeMap(edges.map(e => [e.id, e]))
        } else {
            this.edgesMap = edges
        }
    }

    get nodesList() {
        return Array.from(this.nodesMap.values())
    }

    get edgesList() {
        return Array.from(this.edgesMap.values())
    }
}