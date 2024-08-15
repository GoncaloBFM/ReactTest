import {SingleNode} from "@/types/SingleNode";
import {GraphEdge} from "@/types/GraphEdge";
import {SingleEdgeType} from "@/types/SingleEdgeType";
import {SingleEdge} from "@/types/SingleEdge";
import {GraphNode} from "@/types/GraphNode";

export class CompoundEdge implements GraphEdge{
    id: string;
    target: string;
    origin: string;
    edges: Map<string, SingleEdge>
    static lastId = 0;
    constructor(edges: Array<SingleEdge>) {
        this.id = `ce${CompoundEdge.lastId++}`
        this.edges = new Map(edges.map(edge => [edge.id, edge]));
        this.origin = edges[0].origin
        this.target = edges[0].target
    }

    removeEdges(oldEdges: Array<GraphEdge>) {
        oldEdges.map(edge => this.edges.delete(edge.id))
    }
}
