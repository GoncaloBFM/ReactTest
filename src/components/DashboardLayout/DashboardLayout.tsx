import React, { useMemo, useRef, useState } from "react";
import styles from './DashboardLayout.module.scss'
import { Grid } from "@mui/material";
import { DetailTab } from "@/components/DetailTab/DetailTab";
import { DashboardHeader } from "../DashboardHeader/DashboardHeader";
import { GraphVisualization } from "@/components/GraphVisualization/GraphVisualization";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { SERVER_URL } from "@/app/definitions";
import { useGraphDataManager } from "@/hooks/useGraphDataManager";
import cytoscape from "cytoscape";
import { useCytoscapeManager } from "@/hooks/useCytoscapeManager";
import {GraphNode} from "@/types/GraphNode";
import {GraphElement} from "@/types/GraphElement";
import {DataTable} from "@/components/DataTable/DataTable";
import {Histogram} from "@/components/Histogram/Histogram";


export default function DashboardLayout() {
  const [selectedElements, setSelectedElements] = useState(new Array<GraphElement>());
  const [isLoading, setIsLoading] = useState(false);
  const { graphData, expandNodeData, removeNodeData, loadGraphData } = useGraphDataManager(setIsLoading)
  const cytoscapeManager = useCytoscapeManager(graphData)

  return (
    <div className={styles.DashboardLayout}>
      {isLoading && <LoadingSpinner />}
      <div className={styles.header}>
        <DashboardHeader onSubmitLoadDataPopup={loadGraphData} cytoscapeManager={cytoscapeManager}></DashboardHeader> </div>
      <div className={styles.visualizations}>
        <Grid container className={styles.top}>
          <Grid item xs={10}>
            <GraphVisualization
              setSelectElements={setSelectedElements}
              selectedElements={selectedElements}
              manager={cytoscapeManager}
              graphData={graphData} />
          </Grid>
          <Grid item xs={2}>
            <DetailTab removeNodeData={removeNodeData} expandNodeData={expandNodeData} selectedElements={selectedElements} />
          </Grid>
        </Grid>
        <div className={styles.bottom}>
          <DataTable graphData={graphData} selectedElements={selectedElements} setSelectedElements={setSelectedElements} />
          {/*<Histogram/>*/}
        </div>
      </div>
    </div>
  );
}
