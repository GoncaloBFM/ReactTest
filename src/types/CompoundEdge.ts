import {NodeDataType} from "@/types/NodeDataType";
import {EdgeDataType} from "@/types/EdgeDataType";

export class CompoundEdge {
    edges: Map<string, EdgeDataType>;
    constructor(edges: Array<EdgeDataType>) {
        this.edges = edges ? new Map(edges.map(edge => [edge.id, edge])) : new Map()
    }
}
