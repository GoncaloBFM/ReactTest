import React, {Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState} from 'react';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/en';


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
import {Box, Button, FormControl, MenuItem, Select, Stack} from "@mui/material";
import {GraphManager} from "@/hooks/useGraphDataManager";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import ClearIcon from "@mui/icons-material/Clear";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {EdgeType} from "@/types/EdgeType";
import {NodeType} from "@/types/NodeType";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";

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

    const getTableSelectedElementsRecord = useMemo(() => Object.fromEntries(subSelectedElements.map(e => [e.id, true])), [subSelectedElements])

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
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100% - 56px)', //TODO: move this to a stylesheet
                height: 'calc(100% - 56px)',
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
                {selectedElements.length == 0 &&
                    <Stack direction="row" spacing={1}>
                        <Select
                            size="small"
                            value={elementTypeTableFilter}
                            onChange={event => {
                                setElementTypeTableFilter(event.target.value)
                                setTypeTableFilter(ALL_TYPE_TABLE_FILTER)
                                setSelectedElements([])
                            }}
                        >
                            <MenuItem value={ElementType.node}>Nodes</MenuItem>
                            <MenuItem value={ElementType.edge}>Edges</MenuItem>
                        </Select>
                        <Select
                            size="small"
                            value={typeTableFilter}
                            onChange={event => {
                                setTypeTableFilter(event.target.value)
                                setSelectedElements([])
                            }}
                        ><MenuItem value={ALL_TYPE_TABLE_FILTER}>All</MenuItem>
                            {elementTypeTableFilter == ElementType.node
                                ? [<MenuItem key={1} value={NodeType.person}>Persons</MenuItem>, <MenuItem key={2} value={NodeType.account}>Accounts</MenuItem>]
                                : [<MenuItem key={3} value={EdgeType.transaction}>Transactions</MenuItem>, <MenuItem key={4} value={EdgeType.connection}>Connections</MenuItem>]
                            }
                        </Select>
                        <Button size='small' onClick={() => {
                            setSubSelectedElements(oldTableSelection => {
                                const oldRowIdsSelected = new Set(oldTableSelection.map(e => e.id))
                                return data.filter(e => !oldRowIdsSelected.has(e.id))
                            })
                        }}> Invert selection </Button>
                    </Stack>
                }
                {selectedElements.length > 0 &&
                    <Stack direction="row" spacing={1}>
                        <Button onClick={() => {
                            props.graphManager.expandNodeData(selectedElements.map(e => e.id));}
                        } variant="outlined">
                            <OpenWithIcon/>
                        </Button>
                        <Button onClick={() => {
                            props.graphManager.removeNodeData(selectedElements.map(e => e.id))
                            setSelectedElements([])
                        }} variant="outlined">
                            <ClearIcon/>
                        </Button>
                    </Stack>
                }
                {selectedElements.length > 0 &&
                    <Stack direction="row" spacing={1}>
                        <Button onClick={() => {
                            props.graphManager.removeEdgeData(selectedElements.map(e => e.id))
                            setSelectedElements([])
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
                <MRT_ShowHideColumnsButton table={table} />
            </Box>
        ),
        onRowSelectionChange: (updater: any) => {
            if (data.length == 0) {
                 return
            }

            const newIdsList = Object.keys(updater(getTableSelectedElementsRecord))

            const newTableSelectedElements = (data[0].elementType == ElementType.node)
             ? newIdsList.map((id:string) => props.graphData.nodesMap.get(id))
             : newIdsList.map((id:string) => props.graphData.edgesMap.get(id))

            setSubSelectedElements(newTableSelectedElements)

            return newIdsList
        },

        getRowId: (e) => e.id,

        state: {
            rowSelection: getTableSelectedElementsRecord
        },
    });

    return <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <div className={styles.DataTable}><MaterialReactTable table={table}/></div>
    </LocalizationProvider>
}
