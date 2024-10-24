import Edge = cytoscape.Css.Edge;
import {GraphEdge} from "@/types/GraphEdge";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";
import {timeConverter} from "@/utils/time";

export type TransactionEdgeMetadata = Omit<TransactionEdge, 'data'>

export class TransactionEdge implements GraphEdge {
    source: string
    target: string
    id: string
    type: (typeof EdgeType)[keyof typeof EdgeType];
    amountPaid: number
    currencyPaid: string
    elementType: (typeof ElementType)[keyof typeof ElementType]
    timestamp: string
    data: {[key:string]: string}
    hidden:false;

    constructor(source: string, target: string, id: string, amountPaid: number, currencyPaid: string, data: {[key:string]: string}, timestamp: Date) {
        this.source = source
        this.target = target
        this.id = id
        this.type = EdgeType.transaction
        this.amountPaid = amountPaid
        this.currencyPaid = currencyPaid
        this.data = data
        this.elementType = ElementType.edge
        this.timestamp = timestamp.getDay() + ' ' + timestamp.getMonth() + ' ' + timestamp.getFullYear()
        this.hidden = false
    }
}