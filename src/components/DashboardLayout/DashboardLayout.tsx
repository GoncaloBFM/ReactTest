import React, {useMemo, useRef, useState} from "react";
import styles from './DashboardLayout.module.scss'
import {Box, Grid} from "@mui/material";
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
    const {graphData, graphManager, isLoading} = useGraphDataManager(() => {cytoscapeManager.rerunLayoutAfterRender()}, ()=>{selectedDataManager.setSelectedElements([])})
    const selectedDataManager = useSelectedDataManager()
    const cytoscapeManager = useCytoscapeManager()

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner/>}
            <div className={styles.header}>
                <DashboardHeader onSubmitLoadDataPopup={graphManager.loadGraphData}
                                 cytoscapeManager={cytoscapeManager}></DashboardHeader></div>
            <div className={styles.visualizations}>
                <div className={styles.top}>
                        <GraphVisualization
                            cytoscapeManager={cytoscapeManager}
                            selectedDataManager={selectedDataManager}
                            graphData={graphData}/>
                        <div className={styles.detailTab}>
                        <DetailTab graphData={graphData} selectedDataManager={selectedDataManager} graphManager={graphManager}/>
                        </div>
                </div>
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
