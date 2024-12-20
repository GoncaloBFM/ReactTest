import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";

export class PersonNode implements GraphNode {
    id: string;
    data: {[key:string]: string};
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]
    name: string;
    expanded:boolean;
    hidden:false;
    nationality: string
    address: string

    constructor(id: string, name: string, nationality:string, address:string, data: {[key:string]: string}) {
        this.id = id
        this.type = NodeType.person
        this.elementType = ElementType.node
        this.data = data
        this.name = name
        this.expanded = false
        this.hidden = false
        this.nationality = nationality
        this.address = address
    }

}