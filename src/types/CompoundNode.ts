import {NodeDataType} from "@/types/NodeDataType";

export class CompoundNode {
    nodes: Map<string, NodeDataType>;
    constructor(nodes: Array<NodeDataType>) {
        this.nodes = nodes ? new Map(nodes.map(node => [node.id, node])) : new Map()
    }
}
