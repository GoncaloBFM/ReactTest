import {GraphEdge} from "@/types/GraphEdge";
import {NodeType} from "@/types/NodeType";
import {GraphElement} from "@/types/GraphElement";

export type NodeMetadata = Omit<GraphNode, 'data'>;

export interface GraphNode extends GraphElement {
    type: (typeof NodeType)[keyof typeof NodeType];
    expanded: boolean;
}
