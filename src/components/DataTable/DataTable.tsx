import React, {SetStateAction, useEffect, useState} from 'react';
import styles from './DataTable.module.scss'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { DataGrid} from '@mui/x-data-grid';
import {SingleNode} from "@/types/SingleNode";
import {Graph} from "@/types/Graph";

type Props = {
    setSelectedElement: SetStateAction<any>
    selectedElement: SingleNode | undefined
    graphData: Graph,
};

export function DataTable(props: Props) {
    // Row Data: The data to be displayed.
    return (
        <div className={styles.DataTable}>
            <DataGrid
                rowSelectionModel={props.selectedElement?.id || new Array<string>()}
                rows={props.graphData.nodes}
                columns={
                    ['id', 'name', 'country', 'address', 'birthDate', 'type'].map(
                        (header: string) => {
                            return {field: header, headerName: header, flex: 1}
                        })}
                onRowSelectionModelChange={(ids) => {
                    if (ids.length) {
                        props.setSelectedElement(props.graphData.nodes.filter(node => node.id == ids[0].toString())[0])
                    } else {
                        props.setSelectedElement(undefined)
                    }
                }}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0},
                    },
                }}
            />
        </div>
    )
}

