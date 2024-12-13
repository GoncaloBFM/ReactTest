import React, {Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState} from 'react';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/en';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import {
    MaterialReactTable,
    MRT_RowSelectionState,
    MRT_ShowHideColumnsButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    useMaterialReactTable,
} from 'material-react-table';

//Icons Imports
import {GraphData} from "@/types/GraphData";
import {GraphElement} from "@/types/GraphElement";
import styles from './DataTable.module.scss'
import {ElementType} from '@/types/ElementType';
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";
import {Box, Button, FormControl, IconButton, MenuItem, Select, Stack, Typography} from "@mui/material";
import {GraphManager} from "@/hooks/useGraphDataManager";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {EdgeType} from "@/types/EdgeType";
import {NodeType} from "@/types/NodeType";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Props = {
    graphData: GraphData
    graphManager: GraphManager
    selectedDataManager: SelectedDataManager
};

const ALL_TYPE_TABLE_FILTER = 'all'
export function DataTable(props: Props) {
    const [elementTypeTableFilter, setElementTypeTableFilter] = useState<string>(ElementType.edge)
    const [typeTableFilter, setTypeTableFilter] = useState<string>(ALL_TYPE_TABLE_FILTER)
    const setSelectedElements = props.selectedDataManager.setSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;
    const setSubSelectedElements = props.selectedDataManager.setSubSelectedElements;
    const subSelectedElements = props.selectedDataManager.subSelectedElements;

    const [data, columns] = useMemo(() => {
        let data:GraphElement[]
        let columns: any

        if (selectedElements.length > 0) {
            data = selectedElements
            if (new Set(data.map(e => e.type)).size == 1) {
                columns = TABLE_COLUMNS[data[0].type]
            } else {
                columns = TABLE_COLUMNS[data[0].elementType]
            }
        } else if (elementTypeTableFilter == ElementType.node) {
            if (typeTableFilter == ALL_TYPE_TABLE_FILTER) {
                data = props.graphData.nodesList
                columns = TABLE_COLUMNS[ElementType.node]
            } else {
                data = props.graphData.nodesList.filter(e => e.type == typeTableFilter)
                columns = TABLE_COLUMNS[typeTableFilter as (typeof NodeType)[keyof typeof NodeType]]
            }
        } else if (elementTypeTableFilter == ElementType.edge) {
            if (typeTableFilter == ALL_TYPE_TABLE_FILTER) {
                data = props.graphData.edgesList
                columns = TABLE_COLUMNS[ElementType.edge]
            } else {
                data = props.graphData.edgesList.filter(e => e.type == typeTableFilter)
                columns = TABLE_COLUMNS[typeTableFilter as (typeof EdgeType)[keyof typeof EdgeType]]
            }
        } else {
            throw new Error(`Element type unknown ${elementTypeTableFilter}`)
        }
        return [data, columns]
    }, [selectedElements, props.graphData, typeTableFilter, elementTypeTableFilter])

    const selectedTableElementsRecord = useMemo(() => Object.fromEntries(subSelectedElements.map(e => [e.id, true])), [subSelectedElements])

    const table = useMaterialReactTable({
        columns: columns as any,
        data: data as any,
        layoutMode: 'grid',
        enableFullScreenToggle: true,
        enableHiding: true,
        enableTableFooter: false,
        enableStickyHeader: true,
        enableStickyFooter: false,
        enableColumnFilterModes: true,
        columnFilterDisplayMode: 'popover',
        enableBottomToolbar: false,
        enableRowVirtualization: true,
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100% - 56px)',
                height: 'calc(100% - 56px)',
            },
        },
        muiTablePaperProps: {
            elevation:0,
            sx: {
                height: '100%',
            },
        },
        enableColumnPinning: true,
        enableDensityToggle: false,
        enableRowSelection: true,
        positionToolbarAlertBanner: 'none',
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-select', 'id'],
            },
            density: 'compact',
        },

        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },

        enablePagination:false,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex'}}>
                <Stack direction="row" spacing={1}>
                    {subSelectedElements.length > 0 &&
                        [
                            <Typography key={'1'} variant='subtitle1' className={styles.rowCounter}>
                                {subSelectedElements.length} row{subSelectedElements.length > 1 ? 's' : ''} selected
                            </Typography>,
                        ]
                    }
                    {(subSelectedElements.length == 0 && selectedElements.length == 0) &&
                        [
                            <Select
                                key={'1'}
                                size="small"
                                value={elementTypeTableFilter}
                                onChange={event => {
                                    setElementTypeTableFilter(event.target.value)
                                    setTypeTableFilter(ALL_TYPE_TABLE_FILTER)
                                    setSelectedElements([])
                                }}
                            >
                                <MenuItem value={ElementType.node}>Entities</MenuItem>
                                <MenuItem value={ElementType.edge}>Relations</MenuItem>
                            </Select>,
                            <Select
                                key={'2'}
                                size="small"
                                value={typeTableFilter}
                                onChange={event => {
                                    setTypeTableFilter(event.target.value)
                                    setSelectedElements([])
                                }}
                            ><MenuItem value={ALL_TYPE_TABLE_FILTER}>All</MenuItem>
                                {elementTypeTableFilter == ElementType.node
                                    ? [<MenuItem key={1} value={NodeType.person}>Persons</MenuItem>, <MenuItem key={2} value={NodeType.account}>Accounts</MenuItem>, <MenuItem key={3} value={NodeType.company}>Companies</MenuItem>]
                                    : [<MenuItem key={3} value={EdgeType.transaction}>Transactions</MenuItem>, <MenuItem key={4} value={EdgeType.connection}>Connections</MenuItem>]
                                }
                            </Select>]
                    }
                </Stack>
            </Box>
        ),
        renderToolbarInternalActions: ({ table }) => (
            <Box sx={{ display: 'flex'}}>
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
            </Box>
        ),
        onRowSelectionChange: (updater: any) => {
            if (data.length == 0) {
                 return
            }

            const newIdsList = Object.keys(updater(selectedTableElementsRecord))

            const newTableSelectedElements = (data[0].elementType == ElementType.node)
             ? newIdsList.map((id:string) => props.graphData.nodesMap.get(id))
             : newIdsList.map((id:string) => props.graphData.edgesMap.get(id))

            setSubSelectedElements(newTableSelectedElements)

            return newIdsList
        },
        getRowId: (e) => e.id,
        state: {
            rowSelection: selectedTableElementsRecord
        },
    });

    return <div className={styles.DataTable}><MaterialReactTable table={table}/></div>
}
