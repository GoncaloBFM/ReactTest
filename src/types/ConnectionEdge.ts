import Edge = cytoscape.Css.Edge;
import {GraphEdge} from "@/types/GraphEdge";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";

export type ConnectionEdgeMetadata = Omit<ConnectionEdge, 'data'>

export class ConnectionEdge implements GraphEdge {
    source: string
    target: string
    id: string
    data: {[key:string]: string}
    type: (typeof EdgeType)[keyof typeof EdgeType];
    elementType: (typeof ElementType)[keyof typeof ElementType];
    hidden:false;

    constructor(source: string, target: string, id: string, data: {[key:string]: string}) {
        this.source = source
        this.target = target
        this.id = id
        this.data = data
        this.type = EdgeType.connection
        this.elementType = ElementType.edge
        this.hidden = false
    }
}