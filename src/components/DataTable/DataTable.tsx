import React, {SetStateAction, useEffect, useMemo} from 'react';

import {
    MaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
    useMaterialReactTable,
} from 'material-react-table';


//Icons Imports
import {GraphData} from "@/types/GraphData";
import {GraphElement} from "@/types/GraphElement";
import styles from './DataTable.module.scss'
import Box from '@mui/material/Box';
import {Button, MenuItem, Select, Stack} from "@mui/material";
import {ElementType} from '@/types/ElementType';

type Props = {
    setSelectedElements: SetStateAction<any>
    selectedElements: Array<GraphElement>
    graphData: GraphData,
};


function getAvailableColumns(elements: Array<GraphElement>) {
    const columns = elements
        .map(e => Object.keys(e.data))

        // count each key occurrence
        .reduce((st, keys) => {
            keys.forEach(k => st[k] = true)
            return st;
        }, {} as Record<string, boolean>);

    return Object.keys(columns);
}

function getSuggestedColumns<T>(elements: Array<GraphElement>, count = 5) {
    const columnsCount = elements
        .map(e => Object.keys(e.data))

        // count each key occurrence
        .reduce((st, keys) => {
            keys.forEach(k => st[k] == null
                ? st[k] = 1
                : st[k]++)
            return st;
        }, {} as Record<string, number>);

    return Object.entries(columnsCount)
        // sort descending by count
        .sort((a, b) => b[1] - a[1])

        // get top N
        .slice(0, count - 1)
        .map(e => e[0]);
}

export function DataTable(props: Props) {
    const data = props.selectedElements.length > 0 ? props.selectedElements : props.graphData.nodes
    const [elementTypeSelected, setElementTypeSelected] = React.useState(ElementType.node);
    const columns = useMemo(
        () => [
            ...getAvailableColumns(data)
                .map(key => ({
                    id: key,
                    accessorKey: key,
                    header: key,
                    filterVariant: 'autocomplete',
                }) as const),
        ],
        [data]
    );

    const rowSelectionState = useMemo(
        () => Object.fromEntries(
            props.selectedElements
                ?.map(element => [element.id, true])
            ?? []),
        [props.selectedElements]
    );

    const table = useMaterialReactTable({
        columns,
        data: data,
        layoutMode: 'grid',
        enableFullScreenToggle: true,
        enableHiding: true,
        enableTableFooter: false,
        enableStickyHeader: true,
        enableStickyFooter: false,
        enableBottomToolbar: false,
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100% - 56px)',
            },
        },
        muiTablePaperProps: {
            sx: {
                height: '100%',
            },
        },
        enableColumnPinning: true,
        enableDensityToggle: false,
        enableRowActions: false,
        enableRowSelection: true,
        positionToolbarAlertBanner: 'none', //TODO: change alert bar color and remove button
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select', 'id'],
                right: ['mrt-row-actions'],
            },
            density: 'compact',
        },

        //positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },

        manualPagination: false,
        muiPaginationProps: {
            color: 'secondary',
            shape: 'rounded',
            variant: 'outlined',
        },

        // TODO: add dropdown for type of element to display in table
        // renderTopToolbar: ({ table }) => {
        //   return (
        //       <Stack direction="row" justifyContent="flex-end" className={styles.DashboardHeader}>
        //         <Select value={elementTypeSelected} autoWidth={true} onChange={event => setElementTypeSelected(event.target.value as string)}>
        //           <MenuItem value={ElementType.node}>Nodes</MenuItem>
        //           <MenuItem value={ElementType.edge}>Edges</MenuItem>
        //         </Select>
        //         <MRT_GlobalFilterTextField table={table} />
        //         <MRT_ToggleFiltersButton table={table} />
        //       </Stack>
        //   );
        // },

        getRowId: (e) => e.id,

        onRowSelectionChange: (updaterOrValue) => {
            const selectedState = (typeof (updaterOrValue) == 'function')
                ? updaterOrValue(rowSelectionState)
                : updaterOrValue;

            const ids = Object.entries(selectedState)
                // filter selected === true
                .filter(([_k, v]) => v)
                .map(([k, _v]) => k);

            //props.onSelectElements?.(ids); //TODO: add selection here
        },

        state: {
            rowSelection: rowSelectionState,
        },


    });

    useEffect(() => {
        // auto-set column visibility when data changes
        const suggestedColumns = getSuggestedColumns(data);
        table.setColumnVisibility(
            Object.fromEntries(suggestedColumns.map(k => [k, true])));
    }, [table, data]);

    return <div className={styles.DataTable}><MaterialReactTable table={table}/></div>
}
