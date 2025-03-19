import {GraphNode} from "@/types/GraphNode";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {CompoundNode} from "@/types/CompoundNode";

export class AccountNode implements GraphNode {
    id: string;
    data: {[key:string]: string};
    type: (typeof NodeType)[keyof typeof NodeType];
    elementType: (typeof ElementType)[keyof typeof ElementType]
    iban: string
    nationality:string
    parent: CompoundNode | undefined;

    constructor(id: string, iban: string, nationality:string, data: {[key:string]: string}) {
        this.id = id
        this.type = NodeType.account
        this.elementType = ElementType.node
        this.iban = iban
        this.nationality = nationality
        this.data = data
        this.parent = undefined
    }

}