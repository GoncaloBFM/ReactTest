import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";

export class AccountNode implements GraphNode {
    id: string;
    data: Record<string, unknown>;
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]

    constructor(id: string, data: Record<string, unknown>) {
        this.id = id
        this.type = NodeType.account
        this.elementType = ElementType.node
        this.data = data
    }

}