import React from "react";
import styles from './DashboardLayout.module.scss'
import { Grid } from "@mui/material";
import { TabbedVisualization } from "../TabbedVisualization/TabbedVisualization";
import { Plot } from "../Plot/Plot";
import { PlotTable } from "../PlotTable/PlotTable";
import { usePlottingData } from "@/hooks/usePlottingData";
import { LoadingSpinner } from "../LoadingSpinner";

export default function DashboardLayout() {
    const {
        isLoading,
        data,
        filterData
    } = usePlottingData();

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner />}

            <Grid container>
                <Grid item xs={6} className={styles.plot}>
                    <Plot data={data} filterData={() => filterData({ list: ["1"] })} />
                </Grid>
                <Grid item xs={6} className={styles.tabbedVisualization}>
                    <TabbedVisualization data={data} />
                </Grid>
                <Grid item xs={12} className={styles.plotTable}>
                    <PlotTable data={data} />
                </Grid>
            </Grid>
        </div>
    );
}
