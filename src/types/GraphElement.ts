import {type} from "node:os";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";

export interface GraphElement {
    id: string
    data: Record<string, unknown>
    elementType: (typeof ElementType)[keyof typeof ElementType]
}