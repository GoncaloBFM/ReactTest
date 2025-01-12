import Edge = cytoscape.Css.Edge;
import {GraphEdge} from "@/types/GraphEdge";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";
import {datetimeToString} from "@/utils/time";

export type TransactionEdgeMetadata = Omit<TransactionEdge, 'data'>

export class TransactionEdge implements GraphEdge {
    source: string
    target: string
    id: string
    type: (typeof EdgeType)[keyof typeof EdgeType];
    amountPaid: number
    currency: string
    elementType: (typeof ElementType)[keyof typeof ElementType]
    timestamp: Date
    timestampRepresentation: string
    transactionType: string
    data: {[key:string]: string}
    hidden:false;

    constructor(source: string, target: string, id: string, amountPaid: number, currency: string, transactionType: string, timestamp: Date, data: {[key:string]: string}) {
        this.source = source
        this.target = target
        this.id = id
        this.type = EdgeType.transaction
        this.amountPaid = amountPaid
        this.currency = currency
        this.data = data
        this.transactionType = transactionType
        this.elementType = ElementType.edge
        this.timestamp = timestamp
        this.timestampRepresentation = datetimeToString(timestamp)
        this.hidden = false
    }
}