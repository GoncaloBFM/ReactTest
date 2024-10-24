import {NodeType} from "@/types/NodeType";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";

const ELEMENT_COLUMNS = [{
    id: 'id',
    accessorKey: 'id',
    header: 'Id',
    filterVariant: 'autocomplete',
}]

const TYPE_COLUMN =
 {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    filterVariant: 'autocomplete',
}

const NODE_COLUMNS = ELEMENT_COLUMNS.concat([
    {
        id: 'expanded',
        accessorKey: 'expandedText',
        header: 'Is expanded',
        filterVariant: 'autocomplete',
    }
])

const NODE_COLUMNS_W_TYPE= NODE_COLUMNS.concat([TYPE_COLUMN])

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

const EDGE_COLUMNS_W_TYPE = EDGE_COLUMNS.concat([TYPE_COLUMN])

const NODE_PERSON_COLUMNS = NODE_COLUMNS.concat([{
    id: 'name',
    accessorKey: 'name',
    header: 'Full name',
    filterVariant: 'autocomplete',
}])

const NODE_ACCOUNT_COLUMNS = NODE_COLUMNS.concat([])

const EDGE_CONNECTION_COLUMNS = EDGE_COLUMNS.concat([])

const EDGE_TRANSACTION_COLUMNS = EDGE_COLUMNS.concat([{
    id: 'amountPaid',
    accessorKey: 'amountPaid',
    header: 'Amount',
    filterVariant: 'range',
    filterFn: 'between',
    size: 200,
},{
    id: 'currencyPaid',
    accessorKey: 'currencyPaid',
    header: 'Currency',
    filterVariant: 'autocomplete',
}, { //convert to date for sorting and filtering
    id: 'timestamp',
    header: 'Time',
    accessorKey: 'timestamp',
    filterVariant: 'autocomplete',
}] as any)
    // filterVariant: 'datetime-range',
    // size: 400,
    // Cell: ({cell}: any) => {
    //     return `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`
    // },
export const TABLE_COLUMNS = {
    [NodeType.person]: NODE_PERSON_COLUMNS,
    [NodeType.account]: NODE_ACCOUNT_COLUMNS,
    [EdgeType.connection]: EDGE_CONNECTION_COLUMNS,
    [EdgeType.transaction]: EDGE_TRANSACTION_COLUMNS,
    [ElementType.node]: NODE_COLUMNS_W_TYPE,
    [ElementType.edge]: EDGE_COLUMNS_W_TYPE
}
