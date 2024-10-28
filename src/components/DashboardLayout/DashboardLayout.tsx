import React, {useMemo, useRef, useState} from "react";
import styles from './DashboardLayout.module.scss'
import {Box, Grid, Stack} from "@mui/material";
import {DashboardHeader} from "../DashboardHeader/DashboardHeader";
import {GraphVisualization} from "@/components/GraphVisualization/GraphVisualization";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {useGraphDataManager} from "@/hooks/useGraphDataManager";
import {useCytoscapeManager} from "@/hooks/useCytoscapeManager";
import {GraphElement} from "@/types/GraphElement";
import {DataTable} from "@/components/DataTable/DataTable";
import {useSelectedDataManager} from "@/hooks/useSelectedDataManager";
import {DetailTab} from "@/components/DetailTab/DetailTab";
import Divider from "@mui/material/Divider";



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
                    <Stack direction='row' className={styles.topSplitPanel}>
                        <div className={styles.histogram}>
                        </div>
                        <Divider orientation="vertical"/>
                        <div className={styles.graph}>
                            <GraphVisualization
                                cytoscapeManager={cytoscapeManager}
                                selectedDataManager={selectedDataManager}
                                graphData={graphData}/>
                        </div>
                    </Stack>
                    <div className={styles.detailTab}>
                        <DetailTab
                            graphData={graphData}
                            selectedDataManager={selectedDataManager}
                            graphManager={graphManager}
                            cytoscapeManager={cytoscapeManager}
                        />
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
