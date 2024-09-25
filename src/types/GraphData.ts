import {GraphNode} from "@/types/GraphNode";
import {GraphEdge} from "@/types/GraphEdge";

export type GraphData = {
    nodes: Array<GraphNode>,  //TODO: these should be maps wrapped in a class for ease of access to list / map stuff
    edges: Array<GraphEdge>,
}
