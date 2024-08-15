import {GraphEdge} from "@/types/GraphEdge";
import {CompoundNode} from "@/types/CompoundNode";
import {NodeType} from "@/types/NodeType";
import {GraphNode} from "@/types/GraphNode";

export class SingleNode implements GraphNode{
    id: string
    type: NodeType;
    expanded: boolean;
    compound?: CompoundNode;

    constructor(id: string, type: NodeType) {
        this.id = id;
        this.type = type;
        this.expanded = false;
        this.compound = undefined
    }
}


