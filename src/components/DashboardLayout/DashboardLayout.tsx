import styles from './DashboardLayout.module.scss'
import {Stack} from "@mui/material";
import {DashboardHeader} from "../DashboardHeader/DashboardHeader";
import {GraphVisualization} from "@/components/GraphVisualization/GraphVisualization";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {useGraphDataManager} from "@/hooks/useGraphDataManager";
import {useCytoscapeManager} from "@/hooks/useCytoscapeManager";
import {DataTable} from "@/components/DataTable/DataTable";
import {useSelectedDataManager} from "@/hooks/useSelectedDataManager";
import {DetailTab} from "@/components/DetailTab/DetailTab";
import Divider from "@mui/material/Divider";
import {Summary} from "@/components/Summary/Summary";
import {Histogram} from "@/components/Histogram/Histogram";



export default function DashboardLayout() {
    const {graphData, graphManager, isLoading} = useGraphDataManager(
        () => {cytoscapeManager.rerunLayoutAfterRender()},
        ()=>{selectedDataManager.setSelectedElements([])}
    )
    const selectedDataManager = useSelectedDataManager(() => {})
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
                        <div className={styles.graph}>
                            <GraphVisualization
                                cytoscapeManager={cytoscapeManager}
                                selectedDataManager={selectedDataManager}
                                graphData={graphData}/>
                            <div className={styles.detailTab}>
                                <DetailTab
                                    graphData={graphData}
                                    selectedDataManager={selectedDataManager}
                                    graphManager={graphManager}
                                    cytoscapeManager={cytoscapeManager}
                                />
                            </div>
                        </div>
                        <Divider orientation="vertical"/>
                        <Stack direction='column' className={styles.rightSplitPanel}>
                            <div className={styles.histogram}>
                                <Histogram selectedDataManager={selectedDataManager} graphData={graphData}/>
                            </div>
                            <Divider/>
                            <div className={styles.summary}>
                                    <Summary
                                        selectedDataManager={selectedDataManager}
                                        graphData={graphData}/>
                                </div>
                        </Stack>
                    </Stack>
                </div>
                <Divider/>
                <div className={styles.bottom}>
                    <DataTable
                        graphData={graphData}
                        selectedDataManager={selectedDataManager}
                        graphManager={graphManager}/>
                </div>
            </div>
        </div>
    );
}
