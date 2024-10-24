import React, {useMemo, useRef, useState} from "react";
import styles from './DashboardLayout.module.scss'
import {Grid} from "@mui/material";
import {DashboardHeader} from "../DashboardHeader/DashboardHeader";
import {GraphVisualization} from "@/components/GraphVisualization/GraphVisualization";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {useGraphDataManager} from "@/hooks/useGraphDataManager";
import {useCytoscapeManager} from "@/hooks/useCytoscapeManager";
import {GraphElement} from "@/types/GraphElement";
import {DataTable} from "@/components/DataTable/DataTable";
import {useSelectedDataManager} from "@/hooks/useSelectedDataManager";
import {DetailTab} from "@/components/DetailTab/DetailTab";


export default function DashboardLayout() {
    const {graphData, graphManager, isLoading} = useGraphDataManager()
    const selectedDataManager = useSelectedDataManager()
    const cytoscapeManager = useCytoscapeManager(graphData)

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner/>}
            <div className={styles.header}>
                <DashboardHeader onSubmitLoadDataPopup={graphManager.loadGraphData}
                                 cytoscapeManager={cytoscapeManager}></DashboardHeader></div>
            <div className={styles.visualizations}>
                <Grid container className={styles.top}>
                    <Grid item xs={10}>
                        <GraphVisualization
                            cytoscapeManager={cytoscapeManager}
                            selectedDataManager={selectedDataManager}
                            graphData={graphData}/>
                    </Grid>
                    <Grid item xs={2}>
                        <DetailTab selectedDataManager={selectedDataManager} graphManager={graphManager}/>
                    </Grid>
                </Grid>
                <div className={styles.bottom}>
                    <DataTable
                        graphData={graphData}
                        selectedDataManager={selectedDataManager}
                        graphManager={graphManager}/>
                    {/*<Histogram/>*/}
                </div>
            </div>
        </div>
    );
}
