import {EdgeDataType} from "@/types/EdgeDataType";
import {NodeDataType} from "@/types/NodeDataType";
import {CompoundNode} from "@/types/CompoundNode";
import {CompoundEdge} from "@/types/CompoundEdge";

export class GraphData {
    nodes: Map<string, NodeDataType>;
    edges: Map<string, EdgeDataType>;
    compoundNodes: Map<string, CompoundNode>;
    compoundEdges: Map<string, CompoundEdge>;

    constructor(nodes?: Array<NodeDataType>, edges?: Array<EdgeDataType>, edgesToCompound?: number, nodesToCompound?: number) {
        this.nodes = nodes ? new Map(nodes.map(node => [node.id, node])) : new Map()
        this.edges = edges ? new Map(edges.map(edge => [edge.id, edge])) : new Map()

        this.compoundNodes = new Map()
        this.compoundEdges = new Map()
    }
}