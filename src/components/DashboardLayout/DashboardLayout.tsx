import React, { useMemo, useRef, useState } from "react";
import styles from './DashboardLayout.module.scss'
import { Grid } from "@mui/material";
import { DetailTab } from "@/components/DetailTab/DetailTab";
import { DashboardHeader } from "../DashboardHeader/DashboardHeader";
import { GraphVisualization } from "@/components/GraphVisualization/GraphVisualization";
import { DataTable } from "@/components/DataTable/DataTable";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { SERVER_URL } from "@/app/definitions";
import { useGraphDataManager } from "@/hooks/useGraphDataManager";
import cytoscape from "cytoscape";
import { SingleNode } from "@/types/SingleNode";
import { GraphEdge } from "@/types/GraphEdge";
import { GraphVisualizationProvider } from "../GraphVisualization/GraphVisualizationProvider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { hideNode, selectGraphView, selectSelectedNodes } from "@/lib/features/graphView/graphViewSlice";
import { expandNode, selectGraphDataIsLoading } from "@/lib/features/graphData/graphDataSlice";


export default function DashboardLayout() {
  const [selectedElement, setSelectedElement] = useState<SingleNode | undefined>();

  const dispatch = useAppDispatch();

  const graphView = useAppSelector(state => selectGraphView(state));
  const selectedNodes = useAppSelector(state => selectSelectedNodes(state));
  const isLoading = useAppSelector(selectGraphDataIsLoading);

  return (
    <GraphVisualizationProvider>
      <div className={styles.DashboardLayout}>
        {isLoading && <LoadingSpinner />}
        <div className={styles.header}>
          <DashboardHeader onSubmitLoadDataPopup={async () => { }} />

        </div>
        <div className={styles.Visualizations}>
          <Grid container className={styles.top}>
            <Grid item xs={9}>
              <GraphVisualization />
            </Grid>
            <Grid item xs={3}>
              <DetailTab
                removeNodeData={ids => ids.forEach(id => dispatch(hideNode(id)))}
                expandNodeData={(id) => dispatch(expandNode(id))}
                selectedElement={selectedNodes[0] as any} />
            </Grid>
          </Grid>
          <div className={styles.bottom}>
            <DataTable
              graphData={graphView}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
            />
          </div>
        </div>
      </div>
    </GraphVisualizationProvider>
  );
}
