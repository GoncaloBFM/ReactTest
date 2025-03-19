import {GraphEdge} from "@/types/GraphEdge";
import {NodeType} from "@/types/NodeType";
import {GraphElement} from "@/types/GraphElement";
import {CompoundNode} from "@/types/CompoundNode";

export type NodeMetadata = Omit<GraphNode, 'data'>;

export interface GraphNode extends GraphElement {
    type: (typeof NodeType)[keyof typeof NodeType];
    parent: CompoundNode | undefined;
}
