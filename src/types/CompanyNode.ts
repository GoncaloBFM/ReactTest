import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";

export class CompanyNode implements GraphNode {
    id: string;
    data: {[key:string]: string};
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]
    expanded:boolean;
    hidden:false;
    name: string
    nationality:string
    address:string

    constructor(id: string, name: string, nationality:string, address:string, data: {[key:string]: string}) {
        this.id = id
        this.type = NodeType.company
        this.elementType = ElementType.node
        this.name = name
        this.nationality = nationality
        this.address = address
        this.data = data
        this.expanded = false;
        this.hidden = false
    }

}