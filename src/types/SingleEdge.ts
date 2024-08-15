import {CompoundEdge} from "@/types/CompoundEdge";
import {SingleEdgeType} from "@/types/SingleEdgeType";
import {GraphEdge} from "@/types/GraphEdge";

export class SingleEdge implements GraphEdge{
    origin: string
    target: string
    type:SingleEdgeType
    id:string
    compound?: CompoundEdge;

    constructor(origin: string, target:string, type:SingleEdgeType, id: string) {
        this.origin = origin
        this.target = target
        this.type = type
        this.id = id
        this.compound = undefined;
    }
}