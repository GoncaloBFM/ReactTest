import React, {useMemo, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    MenuItem,
    Modal,
    Select,
    Stack,
    Typography
} from "@mui/material";
import styles from './LoadDataPopup.module.scss';
import {keepPreviousData, useQuery,} from '@tanstack/react-query'; //note: this is TanStack React Query V5
import {
    MaterialReactTable,
    MRT_ColumnFiltersState,
    MRT_PaginationState,
    MRT_ShowHideColumnsButton,
    MRT_SortingState,
    MRT_ToggleFullScreenButton,
    useMaterialReactTable
} from "material-react-table";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";
import {parseRawNode} from "@/utils/responseParser";
import {GraphManager} from "@/hooks/useGraphDataManager";
import {searchDatabase, SearchResponse} from "@/utils/queryGenerator";
import {EdgeType} from "@/types/EdgeType";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphElement} from "@/types/GraphElement";
import {any} from "prop-types";
import {bifurcateBy} from "@/utils/array";
import {GraphNode} from "@/types/GraphNode";
import {GraphEdge} from "@/types/GraphEdge";

type Props = {
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    loadEdges:boolean
    graphManager: GraphManager,
    selectedDataManager: SelectedDataManager
};

type typeSelectedElements = {[key:string]: GraphElement}

const ALL_TYPE_TABLE_FILTER = 'all'
const MAX_ENTITIES = 100
const MAX_RELATIONSHIPS = 10000

export function LoadDataPopup(props: Props) {
    const [elementsSelected, setElementsSelected] = useState<typeSelectedElements>({})
    const [typeTableFilter, setTypeTableFilter] = useState<string>(NodeType.person)
    const [elementTypeTableFilter, setElementTypeTableFilter] = useState<string>(ElementType.node)
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [forceIsLoading, setForceIsLoading] = useState(false)
    const [nodesToFilterBy, setNodesToFilterBy] = useState<string[]>([])
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [openTooManyElementsPopup, setOpenTooManyElementsPopup] = useState(false)

    const {
        data: { data = [], count } = {}, //your data and api response will probably be different
        isError,
        isRefetching,
        isLoading,
        refetch,
    } = useQuery<SearchResponse>({
        queryKey: [
            'table-data',
            typeTableFilter,
            nodesToFilterBy,
            elementTypeTableFilter,
            columnFilters, //refetch when columnFilters changes
            globalFilter, //refetch when globalFilter changes
            pagination.pageIndex, //refetch when pagination.pageIndex changes
            pagination.pageSize, //refetch when pagination.pageSize changes
            sorting, //refetch when sorting changes
        ],
        queryFn: async () => {
            return searchDatabase(
                elementTypeTableFilter,
                nodesToFilterBy,
                true,
                pagination.pageIndex,
                pagination.pageSize,
                typeTableFilter == ALL_TYPE_TABLE_FILTER ? '' : typeTableFilter,
                columnFilters as any,
                sorting as any
            )
        },
        placeholderData: keepPreviousData,
    });

    const selectedElementsCount = useMemo(() => {
        const newSelectedCount:{[key:string]: number} = {}
        Object.values(elementsSelected).forEach(e =>
            newSelectedCount[e.type] = newSelectedCount[e.type] == undefined ? 1 : newSelectedCount[e.type] + 1
        )
        return Object.entries(newSelectedCount).map(entry => `'${entry[0]}': ${entry[1]}`).join(', ')
    }, [elementsSelected])

    const columns = useMemo(() =>
        (TABLE_COLUMNS as any)[(typeTableFilter == ALL_TYPE_TABLE_FILTER ? elementTypeTableFilter : typeTableFilter) as any].filter((e: any) => e.onDB == true)
        , [typeTableFilter, elementTypeTableFilter]
    )
    const closePopup = () => {
        setElementsSelected({})
        props.setOpen(false);
    }

    const table = useMaterialReactTable({
        columns: columns as any,
        data: data as any,
        layoutMode: 'grid',
        initialState: {
            showColumnFilters: true,
            density: 'compact',
            columnPinning: {
                left: ['mrt-row-select', 'id'],
            },
        },
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        positionToolbarAlertBanner: 'none',
        enableDensityToggle: false,
        enableGlobalFilter: false, //disable search feature
        enableRowSelection: true,
        manualFiltering: true, //turn off built-in client-side filtering
        manualPagination: true, //turn off built-in client-side pagination
        manualSorting: true, //turn off built-in client-side sorting
        renderToolbarInternalActions: ({ table }) => (
            <Box sx={{ display: 'flex'}}>
                <Button size={'small'} onClick={() => {
                    if (typeTableFilter == ALL_TYPE_TABLE_FILTER) {
                        setElementsSelected({})
                        return
                    }
                    const filteredElements = {} as typeSelectedElements
                    Object.values(elementsSelected).forEach((v: GraphElement) => {
                       if (v.type != typeTableFilter) {
                           filteredElements[v.id] = v
                       }
                    })
                    setElementsSelected(filteredElements)
                }}> Deselect all </Button>
                <Button size={'small'} onClick={() => {
                    if ((count == undefined) || (elementTypeTableFilter == ElementType.node && count > MAX_ENTITIES) || (elementTypeTableFilter == ElementType.edge && count > MAX_RELATIONSHIPS)) {
                        setOpenTooManyElementsPopup(true)
                        setForceIsLoading(false)
                        return
                    }
                    setForceIsLoading(true)
                    searchDatabase(elementTypeTableFilter, nodesToFilterBy, false, 0, 0, typeTableFilter == ALL_TYPE_TABLE_FILTER ? '' : typeTableFilter, columnFilters as any, sorting as any).then(e=> {
                        const newElements = {} as typeSelectedElements
                        e.data.forEach((v: GraphElement) => {
                            newElements[v.id] = v
                        })
                        setElementsSelected(newElements)
                        setForceIsLoading(false)
                    })
                }}> Select all </Button>
                <MRT_ShowHideColumnsButton table={table} />
            </Box>
        ),
        muiTableContainerProps: {
            sx: {
                maxHeight: '437.547px',
                height: '437.547px',
            },
        },
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex'}}>
                <Stack direction="row" spacing={2} justifyContent={'center'} alignItems={'center'}>
                    <Stack direction={'row'} spacing={1}>
                        <Select
                            key={'2'}
                            size="small"
                            value={typeTableFilter}
                            onChange={event => {
                                setColumnFilters([])
                                setTypeTableFilter(event.target.value)
                            }}
                        >
                            {elementTypeTableFilter == ElementType.node
                                ? [<MenuItem key={1} value={ALL_TYPE_TABLE_FILTER}>All</MenuItem>, <MenuItem key={2} value={NodeType.person}>Persons</MenuItem>, <MenuItem key={3} value={NodeType.account}>Accounts</MenuItem>, <MenuItem key={4} value={NodeType.company}>Companies</MenuItem>]
                                : [<MenuItem key={1} value={ALL_TYPE_TABLE_FILTER}>All</MenuItem>, <MenuItem key={2} value={EdgeType.transaction}>Transactions</MenuItem>, <MenuItem key={3} value={EdgeType.connection}>Connections</MenuItem>]
                            }
                        </Select>
                    </Stack>
                    <Typography key={'1'} variant='subtitle1' className={styles.rowCounter}>
                        {selectedElementsCount}
                    </Typography>
                </Stack>
            </Box>
        ),
        onRowSelectionChange: (updater: any) => {
            const newUpdater = (oldSelectedElements: Record<string, any>) => {
                const newSelectedElements = updater(oldSelectedElements)
                const newSelectedElementsIds = Object.keys(updater())
                newSelectedElementsIds.forEach(newId =>
                    newSelectedElements[newId] = data.find((e:any) => e.id == newId)
                )
                return newSelectedElements
            }
            setElementsSelected(newUpdater)
        },
        getRowId: (e) => e.id,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        enableFilterMatchHighlighting: false,
        enableSelectAll: false,
        rowCount: count,
        state: {
            rowSelection: elementsSelected as any,
            columnFilters,
            globalFilter,
            isLoading: isLoading || isRefetching || forceIsLoading,
            pagination,
            showAlertBanner: isError,
            sorting,
        },
    });

    return (
        <Modal
            open={props.isOpen}
            onClose={closePopup}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={styles.LoadDataPopup}>
                <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                        <Button size={'small'} onClick={() => {
                            closePopup();
                        }}>Close</Button>
                        <Stack direction='row' spacing={1}>
                            {/*<Button disabled={selectedElementsCount == 0} size={'small'} onClick={() => {*/}
                            {/*    const newNodes = (Object.values(elementsSelected) as Record<string, any>[]).map(parseRawNode)*/}
                            {/*    props.graphManager.addToGraph(newNodes, [])*/}
                            {/*    props.selectedDataManager.setSelectedElements(newNodes)*/}
                            {/*    closePopup()*/}
                            {/*}}>Add selection to graph*/}
                            {/*</Button>*/}
                            <Button disabled={elementTypeTableFilter == ElementType.node} size={'small'} onClick={() => {
                                setNodesToFilterBy([])
                                setElementTypeTableFilter(ElementType.node)
                                setTypeTableFilter(NodeType.person)
                                setColumnFilters([])
                            }}>Back</Button>
                            {elementTypeTableFilter == ElementType.node
                                ? <Button disabled={selectedElementsCount.length == 0} size={'small'} onClick={() => {
                                    setNodesToFilterBy(Object.keys(elementsSelected))
                                    setElementTypeTableFilter(ElementType.edge)
                                    setTypeTableFilter(EdgeType.connection)
                                    setColumnFilters([])
                                }}>Next</Button>
                                : <Button disabled={selectedElementsCount.length == 0} size={'small'} onClick={() => {
                                    const [newNodes, newEdges] = bifurcateBy(Object.values(elementsSelected), e=> e.elementType == ElementType.node)
                                    props.graphManager.addToGraph(newNodes as GraphNode[], newEdges as GraphEdge[])
                                    props.selectedDataManager.setSelectedElements(newNodes)
                                    closePopup()
                                }}>Import Selected</Button>
                            }
                        </Stack>
                    </Stack>
                    <MaterialReactTable table={table}></MaterialReactTable>
                </Stack>
                <Dialog
                    open={openTooManyElementsPopup}
                    onClose={() => setOpenTooManyElementsPopup(false)}
                >
                    <DialogTitle>
                        Too many elements to select
                    </DialogTitle>
                    <DialogContent>
                        It is only possible to select {MAX_ENTITIES} entities and {MAX_RELATIONSHIPS} relationships at a time.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenTooManyElementsPopup(false)} autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    )
}
