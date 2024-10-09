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


export default function DashboardLayout() {
    const [selectedElements, setSelectedElements] = useState(new Array<GraphElement>());
    const {graphData, graphManager, isLoading} = useGraphDataManager()
    const cytoscapeManager = useCytoscapeManager(graphData)

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner/>}
            <div className={styles.header}>
                <DashboardHeader onSubmitLoadDataPopup={graphManager.loadGraphData}
                                 cytoscapeManager={cytoscapeManager}></DashboardHeader></div>
            <div className={styles.visualizations}>
                <Grid container className={styles.top}>
                    <Grid item xs={12}>
                        <GraphVisualization
                            setSelectElements={setSelectedElements}
                            selectedElements={selectedElements}
                            manager={cytoscapeManager}
                            graphData={graphData}/>
                    </Grid>
                    {/*<Grid item xs={2}>*/}
                    {/*    <DetailTab graphManager={graphManager}*/}
                    {/*               selectedElements={selectedElements}/>*/}
                    {/*</Grid>*/}
                </Grid>
                <div className={styles.bottom}>
                    <DataTable
                        graphData={graphData}
                        selectedElements={selectedElements}
                        setSelectedElements={setSelectedElements}
                        graphManager={graphManager}/>
                    {/*<Histogram/>*/}
                </div>
            </div>
        </div>
    );
}
