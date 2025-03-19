import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {CompoundNode} from "@/types/CompoundNode";

export class CompanyNode implements GraphNode {
    id: string;
    data: {[key:string]: string};
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]
    name: string
    nationality:string
    address:string
    parent: CompoundNode | undefined;

    constructor(id: string, name: string, nationality:string, address:string, data: {[key:string]: string}) {
        this.id = id
        this.type = NodeType.company
        this.elementType = ElementType.node
        this.name = name
        this.nationality = nationality
        this.address = address
        this.data = data
        this.parent = undefined
    }

}