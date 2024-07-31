import React from "react";
import styles from './DashboardLayout.module.scss'
import { Grid } from "@mui/material";
import { TabbedVisualization } from "../TabbedVisualization/TabbedVisualization";
import { DashboardHeader } from "../DashboardHeader/DashboardHeader";
import { GraphVisualization } from "@/components/GraphVisualization/GraphVisualization";
import { DataTable } from "@/components/DataTable/DataTable";
import { usePlottingData } from "@/hooks/usePlottingData";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

export default function DashboardLayout() {
    const {
        isLoading,
        data,
        filterData
    } = usePlottingData();

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner />}
            <div className={styles.header}> <DashboardHeader></DashboardHeader> </div>
            <Grid container className={styles.visualizations}>
                    <Grid item xs={6} className={styles.graphVisualization}>
                        <GraphVisualization data={data} filterData={() => filterData({ list: ["1"] })} />
                    </Grid>
                    <Grid item xs={6} className={styles.tabbedVisualization}>
                        <TabbedVisualization data={data} />
                    </Grid>
                    <Grid item xs={12} className={styles.dataTable}>
                        <DataTable data={data} />
                    </Grid>
                </Grid>
        </div>
    );
}
