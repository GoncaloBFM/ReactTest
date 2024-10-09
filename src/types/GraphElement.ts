import {type} from "node:os";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";

export interface GraphElement {
    id: string
    data: {[key:string]: string}
    elementType: (typeof ElementType)[keyof typeof ElementType]
    hidden: boolean
}