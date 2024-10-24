import {GraphElement} from "@/types/GraphElement";
import {EdgeType} from "@/types/EdgeType";

export interface GraphEdge extends GraphElement {
    source: string
    target: string
    type: (typeof EdgeType)[keyof typeof EdgeType]
}
