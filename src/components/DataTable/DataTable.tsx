import React, {useState} from 'react';
import styles from './DataTable.module.scss'
import { PlottingData } from '@/hooks/usePlottingData';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

type Props = {
    data: PlottingData,
};

export function DataTable(props: Props) {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" }
    ]);

    return (
        <div className={`ag-theme-quartz ${styles.DataTable}`}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
            />test
        </div>
    )
}
