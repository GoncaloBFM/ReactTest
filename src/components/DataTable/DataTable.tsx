import React, {SetStateAction, useEffect, useMemo, useState} from 'react';

import {
    MaterialReactTable,
    MRT_ColumnActionMenu,
    MRT_ColumnDef,
    MRT_GlobalFilterTextField,
    MRT_RowSelectionState,
    MRT_ShowHideColumnsButton,
    MRT_ShowHideColumnsMenu,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
    useMaterialReactTable,
} from 'material-react-table';


//Icons Imports
import {GraphData} from "@/types/GraphData";
import {GraphElement} from "@/types/GraphElement";
import styles from './DataTable.module.scss'
import {ElementType} from '@/types/ElementType';
import {GraphNode} from "@/types/GraphNode";
import {GraphEdge} from "@/types/GraphEdge";
import {PersonNode} from "@/types/PersonNode";
import {AccountNode} from "@/types/AccountNode";
import {TransactionEdge} from "@/types/TransactionEdge";
import {ConnectionEdge} from "@/types/ConnectionEdge";
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";
import {Box, Button, IconButton, Stack} from "@mui/material";
import {GraphManager} from "@/hooks/useGraphDataManager";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
    setSelectedElements: SetStateAction<any>
    selectedElements: Array<GraphElement>
    graphData: GraphData,
    graphManager: GraphManager
};

export function DataTable(props: Props) {
    const data = useMemo(() =>
        (props.selectedElements.length > 0) ? props.selectedElements : props.graphData.edges
    , [props.selectedElements, props.graphData])
    const elementType = data.length > 0 ? data[0].elementType : ElementType.edge

    const columns = useMemo(() =>
        elementType == ElementType.node ? TABLE_COLUMNS.node : TABLE_COLUMNS.edge
    , [elementType])

    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available

    // const subSelectedElements = useMemo(
    //     () => {return Object.fromEntries(props.selectedElements.map(element => [element.id, true]))},
    //     [props.selectedElements]
    // );
    //

    useEffect(() => setRowSelection({}), [setRowSelection, props.selectedElements]);

    const table = useMaterialReactTable({
        columns: columns as any,
        data: data as any,
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
        positionToolbarAlertBanner: 'none',
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select', 'id'],
                right: ['mrt-row-actions'],
            },
            density: 'compact',
        },

        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },

        manualPagination: true,
        muiPaginationProps: {
            color: 'secondary',
            shape: 'rounded',
            variant: 'outlined',
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex'}}>
                {props.selectedElements.length > 0 && elementType == ElementType.node &&
                    <Stack direction="row" spacing={1}>
                        <Button onClick={() => {
                            props.graphManager.expandNodeData(props.selectedElements.map(e => e.id));}
                        } variant="outlined">
                            <OpenWithIcon/>
                        </Button>
                        <Button onClick={() => {
                            props.graphManager.removeNodeData(props.selectedElements.map(e => e.id))
                            props.setSelectedElements([])
                        }} variant="outlined">
                            <ClearIcon/>
                        </Button>
                    </Stack>
                }
                {props.selectedElements.length > 0 && elementType == ElementType.edge &&
                    <Stack direction="row" spacing={1}>
                        <Button onClick={() => {
                            props.graphManager.removeEdgeData(props.selectedElements.map(e => e.id))
                            props.setSelectedElements([])
                        }} variant="outlined">
                            <ClearIcon/>
                        </Button>
                    </Stack>
                }
            </Box>
        ),
        renderToolbarInternalActions: ({ table }) => (
            <Box sx={{ display: 'flex'}}>
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
            </Box>
        ),
        onRowSelectionChange: setRowSelection,

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

        state: {
            rowSelection: rowSelection,
        },


    });

    return <div className={styles.DataTable}><MaterialReactTable table={table}/></div>
}
