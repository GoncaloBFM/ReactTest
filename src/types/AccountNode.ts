import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";

export class AccountNode implements GraphNode {
    id: string;
    data: {[key:string]: string};
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]
    expanded:boolean;
    hidden:false;

    constructor(id: string, data: {[key:string]: string}) {
        this.id = id
        this.type = NodeType.account
        this.elementType = ElementType.node
        this.data = data
        this.expanded = false;
        this.hidden = false
    }

}