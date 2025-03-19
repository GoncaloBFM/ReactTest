import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import { CompoundNode } from "./CompoundNode";

export class PersonNode implements GraphNode {
    id: string;
    data: {[key:string]: string};
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]
    name: string;
    nationality: string;
    address: string;
    parent: CompoundNode | undefined;

    constructor(id: string, name: string, nationality:string, address:string, data: {[key:string]: string}) {
        this.id = id
        this.type = NodeType.person
        this.elementType = ElementType.node
        this.data = data
        this.name = name
        this.nationality = nationality
        this.address = address
        this.parent = undefined
    }

}