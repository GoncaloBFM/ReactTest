import {NodeType} from "@/types/NodeType";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";

const ELEMENT_COLUMNS = [{
    id: 'id',
    accessorKey: 'id',
    header: 'Id',
    filterVariant: 'autocomplete',
}, {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    filterVariant: 'autocomplete',
}]

const NODE_COLUMNS = ELEMENT_COLUMNS.concat([])

const EDGE_COLUMNS = ELEMENT_COLUMNS.concat([{
    id: 'source',
    accessorKey: 'source',
    header: 'Source Id',
    filterVariant: 'autocomplete',
}, {
    id: 'target',
    accessorKey: 'target',
    header: 'Target Id',
    filterVariant: 'autocomplete',
}])

const NODE_PERSON_COLUMNS = NODE_COLUMNS.concat([{
    id: 'name',
    accessorKey: 'name',
    header: 'Full name',
    filterVariant: 'autocomplete',
}])

const NODE_ACCOUNT_COLUMNS = NODE_PERSON_COLUMNS.concat([])

const EDGE_CONNECTION_COLUMNS = EDGE_COLUMNS.concat([])

const EDGE_TRANSACTION_COLUMNS = EDGE_COLUMNS.concat([{
    id: 'amountPaid',
    accessorKey: 'amountPaid',
    header: 'Amount',
    filterVariant: 'autocomplete',
},{
    id: 'currencyPaid',
    accessorKey: 'currencyPaid',
    header: 'Currency',
    filterVariant: 'autocomplete',
},{
    id: 'timestamp',
    accessorKey: 'timestamp',
    header: 'Timestamp',
    filterVariant: 'autocomplete',
}])

export const TABLE_COLUMNS = {
    [NodeType.person]: NODE_PERSON_COLUMNS,
    [NodeType.account]: NODE_ACCOUNT_COLUMNS,
    [EdgeType.connection]: EDGE_CONNECTION_COLUMNS,
    [EdgeType.transaction]: EDGE_TRANSACTION_COLUMNS,
    [ElementType.node]: NODE_PERSON_COLUMNS.concat(NODE_ACCOUNT_COLUMNS).filter(
        (obj1, i, array) => array.findIndex(obj2 => (obj2.id === obj1.id)) === i),
    [ElementType.edge]: EDGE_TRANSACTION_COLUMNS.concat(EDGE_CONNECTION_COLUMNS).filter(
        (obj1, i, array) => array.findIndex(obj2 => (obj2.id === obj1.id)) === i),
} as const
