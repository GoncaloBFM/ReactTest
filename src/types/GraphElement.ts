import {type} from "node:os";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";

export interface GraphElement {
    id: string
    data: {[key:string]: string}
    elementType: (typeof ElementType)[keyof typeof ElementType]
    type: (typeof EdgeType)[keyof typeof EdgeType] | (typeof NodeType)[keyof typeof NodeType];
}