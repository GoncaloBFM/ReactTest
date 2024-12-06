import React, {useMemo, useRef, useState} from 'react';
import {TextField, Stack, Modal, Box, Button, TextFieldProps, Typography, Select, MenuItem} from "@mui/material";
import styles from './LoadDataPopup.module.scss';
import {DataGrid, GridColDef, useGridApiRef} from '@mui/x-data-grid';


import {useLoadDataPopupSearch} from '@/hooks/useLoadDataPopupSearch';
import {LoadingSpinner} from "@/components/LoadingSpinner/LoadingSpinner";
import {MRT_ShowHideColumnsButton, MRT_ToggleFullScreenButton, useMaterialReactTable} from "material-react-table";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {EdgeType} from "@/types/EdgeType";
import {GraphElement} from "@/types/GraphElement";
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";

type Props = {
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    onSubmit: (nodesIds: Array<string>) => void
};

export function NewDataPopup(props: Props) {
    const closePopup = () => {
        props.setOpen(false);
    }

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
        } else {
            throw new Error(`Element type unknown ${elementTypeTableFilter}`)
        }
        return [data, columns]
    }, [selectedElements, props.graphData, typeTableFilter, elementTypeTableFilter])


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
        renderToolbarInternalActions: ({ table }) => (
            <Box sx={{ display: 'flex'}}>
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
            </Box>
        ),
    })
    return (
        <Modal
            open={props.isOpen}
            onClose={closePopup}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Stack>
                <Stack direction="row" justifyContent="right">
                    <Stack direction="row" spacing={1}>
                        <Button onClick={() => {props.setOpen(false)}}>Cancel</Button>
                        <Button variant="outlined" size={'small'} onClick={() => {}}>Submit</Button>
                    </Stack>
                </Stack>
                <Box className={styles.LoadDataPopup}>
                    <div className={styles.table}>

                    </div>
                </Box>
            </Stack>
        </Modal>
    )
}
