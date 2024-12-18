import React, {useMemo, useRef, useState} from 'react';
import {
    Stack,
    Modal,
    Box,
    Button,
    Select, MenuItem, Typography
} from "@mui/material";
import styles from './LoadDataPopup.module.scss';
import {
    keepPreviousData,
    useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5

import {LoadingSpinner} from "@/components/LoadingSpinner/LoadingSpinner";
import {
    MaterialReactTable,
    MRT_ColumnDef,
    MRT_ColumnFiltersState,
    MRT_PaginationState, MRT_ShowHideColumnsButton,
    MRT_SortingState, MRT_ToggleFullScreenButton,
    useMaterialReactTable
} from "material-react-table";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {EdgeType} from "@/types/EdgeType";
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";
import {SERVER_URL} from "@/app/definitions";
import {GraphElement} from "@/types/GraphElement";
import {parseRawNode} from "@/utils/apiResponseParser";
import {useSelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphManager, useGraphDataManager} from "@/hooks/useGraphDataManager";

type Props = {
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    graphManager: GraphManager
};

export function LoadDataPopup(props: Props) {
    const [elementsSelected, setElementsSelected] = useState({})
    const [typeTableFilter, setTypeTableFilter] = useState<string>(NodeType.person)
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
        [],
    );
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const {
        data: { data = [], count } = {}, //your data and api response will probably be different
        isError,
        isRefetching,
        isLoading,
        refetch,
    } = useQuery<ApiResponse>({
        queryKey: [
            'table-data',
            typeTableFilter,
            columnFilters, //refetch when columnFilters changes
            globalFilter, //refetch when globalFilter changes
            pagination.pageIndex, //refetch when pagination.pageIndex changes
            pagination.pageSize, //refetch when pagination.pageSize changes
            sorting, //refetch when sorting changes
        ],
        queryFn: async () => {
            const fetchURL = new URL('/nodes', SERVER_URL);

            fetchURL.searchParams.set(
                'start',
                `${pagination.pageIndex * pagination.pageSize}`,
            );
            fetchURL.searchParams.set('size', `${pagination.pageSize}`);
            fetchURL.searchParams.set('filters', JSON.stringify((columnFilters ?? []).concat(
                typeTableFilter == ElementType.node ? [] : [{'id':'type', 'value':typeTableFilter}]
            )));
            fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

            const response = await fetch(fetchURL.href);
            const [body, status] = (await response.json())
            if (status != 200)
                throw Error()
            const data = body['data'].map(parseRawNode)
            const count = body['count']
            return {data:data, count:count} as ApiResponse
        },
        placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
    });

    const selectedElementsCount = useMemo(() => Object.keys(elementsSelected).length, [elementsSelected])

    const columns = useMemo(() => TABLE_COLUMNS[typeTableFilter as (typeof NodeType)[keyof typeof NodeType]], [typeTableFilter])
    const closePopup = () => {
        setElementsSelected([])
        props.setOpen(false);
    }

    type ApiResponse = {
        data: GraphElement[];
        count: number
    };

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
                <MRT_ToggleFullScreenButton table={table} />
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
                    <Select
                        key={'2'}
                        size="small"
                        value={typeTableFilter}
                        onChange={event => {
                            setElementsSelected({})
                            setTypeTableFilter(event.target.value)
                        }}
                    >
                        <MenuItem value={NodeType.person}>Persons</MenuItem>
                        <MenuItem value={NodeType.company}>Companies</MenuItem>
                        <MenuItem value={NodeType.account}>Accounts</MenuItem>
                    </Select>
                    <Typography key={'1'} variant='subtitle1' className={styles.rowCounter}>
                        {selectedElementsCount} selected
                    </Typography>
                </Stack>
            </Box>
        ),
        onRowSelectionChange: (updater: any) => {
            const newUpdater = (oldSelectedElements: Record<string, any>) => {
                const newSelectedElements = updater(oldSelectedElements)
                const newSelectedElementsIds = Object.keys(updater())
                if (newSelectedElementsIds.length == 1) {
                    const newId = newSelectedElementsIds[0]
                    newSelectedElements[newId] = data.find((e:any) => e.id == newId)
                }
                return newSelectedElements
            }
            setElementsSelected(newUpdater)

        },
        getRowId: (e) => e.id,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        enableFilterMatchHighlighting: false,
        rowCount: count,
        state: {
            rowSelection: elementsSelected,
            columnFilters,
            globalFilter,
            isLoading: isLoading || isRefetching,
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
                        <Button size={'small'} onClick={() => {
                            const newNodes = (Object.values(elementsSelected) as Record<string, any>[]).map(parseRawNode)
                            props.graphManager.addToGraph(newNodes, [])
                            closePopup()
                        }}>Add to graph</Button>
                    </Stack>
                    <MaterialReactTable table={table}></MaterialReactTable>
                </Stack>
            </Box>
        </Modal>
    )
}
