import Edge = cytoscape.Css.Edge;
import {GraphEdge} from "@/types/GraphEdge";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";

export type TransactionEdgeMetadata = Omit<TransactionEdge, 'data'>

export class TransactionEdge implements GraphEdge {
    source: string
    target: string
    id: string
    type: (typeof EdgeType)[keyof typeof EdgeType];
    amountPaid: number
    currencyPaid: string
    elementType: (typeof ElementType)[keyof typeof ElementType]
    timestamp: number | undefined
    data: {[key:string]: string}
    hidden:false;

    constructor(source: string, target: string, id: string, amountPaid: number, currencyPaid: string, data: {[key:string]: string}, timestamp?: number) {
        this.source = source
        this.target = target
        this.id = id
        this.type = EdgeType.transaction
        this.amountPaid = amountPaid
        this.currencyPaid = currencyPaid
        this.data = data
        this.elementType = ElementType.edge
        this.timestamp = timestamp
        this.hidden = false
    }
}