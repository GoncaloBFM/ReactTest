import {NodeType} from "@/types/NodeType";
import {EdgeType} from "@/types/EdgeType";
import {ElementType} from "@/types/ElementType";

const ELEMENT_COLUMNS = [{
    id: 'id',
    accessorKey: 'id',
    header: 'Id',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}]

const NODE_TYPE_COLUMN =
    {
        id: 'type',
        accessorKey: 'type',
        header: 'Type',
        onDB: true,
        filterVariant: 'multi-select',
        size: 200,
        filterSelectOptions: [NodeType.account, NodeType.person, NodeType.company]
    }

const EDGE_TYPE_COLUMN =
    {
        id: 'type',
        accessorKey: 'type',
        header: 'Type',
        onDB: true,
        filterVariant: 'multi-select',
        size: 200,
        filterSelectOptions: [EdgeType.transaction, EdgeType.connection]
    }

// const NODE_COLUMNS = ELEMENT_COLUMNS.concat([
//     {
//         id: 'expanded',
//         accessorKey: 'expanded',
//         header: 'Is expanded',
//         filterVariant: 'checkbox',
//         size: 200,
//         Cell: ({cell}:any) => cell.getValue() ? 'yes' : 'no'
//     } as any
// ])

const NODE_COLUMNS = ELEMENT_COLUMNS.concat([])

const NODE_COLUMNS_W_TYPE= NODE_COLUMNS.concat([NODE_TYPE_COLUMN])

const EDGE_COLUMNS = ELEMENT_COLUMNS.concat([{
    id: 'source',
    accessorKey: 'source',
    header: 'Source Id',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}, {
    id: 'target',
    accessorKey: 'target',
    header: 'Target Id',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}])

const EDGE_COLUMNS_W_TYPE = EDGE_COLUMNS.concat([EDGE_TYPE_COLUMN])

const NODE_COMPOUND_COLUMN = NODE_COLUMNS.concat([])
const NODE_PERSON_COLUMNS = NODE_COLUMNS.concat([{
    id: 'name',
    accessorKey: 'name',
    header: 'Full name',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}, {
    id: 'nationality',
    accessorKey: 'nationality',
    header: 'Nationality',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}, {
    id: 'address',
    accessorKey: 'address',
    header: 'Address',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}])

const NODE_COMPANY_COLUMNS = NODE_COLUMNS.concat([{
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}, {
    id: 'nationality',
    accessorKey: 'nationality',
    header: 'Nationality',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}, {
    id: 'address',
    accessorKey: 'address',
    header: 'Address',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}])

const NODE_ACCOUNT_COLUMNS = NODE_COLUMNS.concat([{
    id: 'iban',
    accessorKey: 'iban',
    header: 'IBAN',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}, {
    id: 'nationality',
    accessorKey: 'nationality',
    header: 'Nationality',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}])

const EDGE_CONNECTION_COLUMNS = EDGE_COLUMNS.concat([])

const EDGE_TRANSACTION_COLUMNS = EDGE_COLUMNS.concat([{
    id: 'amountPaid',
    accessorKey: 'amountPaid',
    header: 'Amount',
    onDB: true,
    filterVariant: 'range',
    size: 200,
},{
    id: 'currency',
    accessorKey: 'currency',
    header: 'Currency',
    onDB: true,
    filterVariant: 'text',
    size: 200,
},{
    id: 'transactionType',
    accessorKey: 'transactionType',
    header: 'Transaction type',
    onDB: true,
    filterVariant: 'text',
    size: 200,
}, { //convert to date for sorting and filtering
    id: 'timestampRepresentation',
    header: 'Time',
    accessorKey: 'timestamp',
    filterFn: 'between', //set filter mode to equals
    onDB: false,
    filterVariant: 'datetime-range',
    size: 200,
    Cell: ({row}:any) => row.original.timestampRepresentation
}] as any)
export const TABLE_COLUMNS = {
    [NodeType.person]: NODE_PERSON_COLUMNS,
    [NodeType.account]: NODE_ACCOUNT_COLUMNS,
    [NodeType.company]: NODE_COMPANY_COLUMNS,
    [NodeType.compound]: NODE_COMPOUND_COLUMN,
    [EdgeType.connection]: EDGE_CONNECTION_COLUMNS,
    [EdgeType.transaction]: EDGE_TRANSACTION_COLUMNS,
    [ElementType.node]: NODE_COLUMNS_W_TYPE,
    [ElementType.edge]: EDGE_COLUMNS_W_TYPE
}
