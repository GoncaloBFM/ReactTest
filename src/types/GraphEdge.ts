import {CompoundEdge} from "@/types/CompoundEdge";
import {SingleEdgeType} from "@/types/SingleEdgeType";
import {GraphElement} from "@/types/GraphElement";

export interface GraphEdge extends GraphElement{
    origin: string
    target: string
}