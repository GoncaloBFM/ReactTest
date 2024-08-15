import {SingleNode} from "@/types/SingleNode";
import {GraphNode} from "@/types/GraphNode";
import {SingleEdge} from "@/types/SingleEdge";

export class CompoundNode implements GraphNode {
    nodes: Map<string, SingleNode>
    id: string;
    expanded: boolean;
    static lastId = 0;
    constructor(nodes: Array<SingleNode>) {
        this.id = `cn${CompoundNode.lastId++}`
        this.expanded = false;
        this.nodes = new Map(nodes.map(node => [node.id, node]));
    }

    removeNodes(oldNodes: Array<GraphNode>) {
        oldNodes.map(node => this.nodes.delete(node.id))
    }
}
