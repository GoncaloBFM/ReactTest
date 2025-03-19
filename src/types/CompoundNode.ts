import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {GraphEdge} from "@/types/GraphEdge";

export class CompoundNode implements GraphNode {
    static idCount = 0
    id: string;
    nodeList: string[];
    oldEdges: GraphEdge[];
    type: (typeof NodeType)[keyof typeof NodeType];
    data: { [key: string]: string; };
    elementType: (typeof ElementType)[keyof typeof ElementType]
    parent: CompoundNode | undefined;

    constructor(nodeList: string[], oldEdges: GraphEdge[]) {
        this.id = `compound${CompoundNode.idCount++}`
        this.nodeList = nodeList
        this.oldEdges = oldEdges
        this.type = NodeType.compound
        this.elementType = ElementType.node
        this.data = {}
        this.parent = undefined
    }
}