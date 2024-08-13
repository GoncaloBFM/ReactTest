import React, {useMemo, useRef, useState} from "react";
import styles from './DashboardLayout.module.scss'
import { Grid } from "@mui/material";
import { DetailTab } from "@/components/DetailTab/DetailTab";
import { DashboardHeader } from "../DashboardHeader/DashboardHeader";
import { GraphVisualization } from "@/components/GraphVisualization/GraphVisualization";
import { DataTable } from "@/components/DataTable/DataTable";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import {SERVER_URL} from "@/app/definitions";
import {useGraphDataManager} from "@/hooks/useGraphDataManager";
import cytoscape from "cytoscape";
import {NodeDataType} from "@/types/NodeDataType";
import {EdgeDataType} from "@/types/EdgeDataType";
import {COSE} from "@/components/GraphVisualization/CytoscapeLayouts";
import {useCytoscapeManager} from "@/hooks/useCytoscapeManager";


export default function DashboardLayout() {
    const [selectedElement, setSelectedElement] = useState<NodeDataType | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const {graphData, expandNodeData, removeNodeData, loadGraphData} = useGraphDataManager(setIsLoading)
    const cytoscapeManager = useCytoscapeManager(COSE)

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner />}
            <div className={styles.header}>
                <DashboardHeader onSubmitLoadDataPopup={loadGraphData} cytoscapeManager={cytoscapeManager}></DashboardHeader> </div>
            <div className={styles.Visualizations}>
                <Grid container className={styles.top}>
                    <Grid item xs={9}>
                        <GraphVisualization
                            selectedElement={selectedElement}
                            setSelectedElement={setSelectedElement}
                            manager={cytoscapeManager}
                            graphData={graphData}/>
                    </Grid>
                    <Grid item xs={3}>
                        <DetailTab removeNodeData={removeNodeData} expandNodeData={expandNodeData} selectedElement={selectedElement}/>
                    </Grid>
                </Grid>
                <div className={styles.bottom}>
                    <DataTable graphData={graphData} selectedElement={selectedElement} setSelectedElement={setSelectedElement}/>
                </div>
            </div>
        </div>
    );
}
