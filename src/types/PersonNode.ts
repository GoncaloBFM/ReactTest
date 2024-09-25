import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";

export class PersonNode implements GraphNode {
    id: string;
    data: Record<string, unknown>;
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]
    name: string;

    constructor(id: string, name: string, data: Record<string, unknown>) {
        this.id = id
        this.type = NodeType.person
        this.elementType = ElementType.node
        this.data = data
        this.name = name
    }

}