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
import {BasicAnalysis} from "@/components/BasicAnalysis/BasicAnalysis";
import {useState} from "react";
import {FlowAnalysis} from "@/components/FlowAnalysis/FlowAnalysis";



export default function DashboardLayout() {
    const [showBasicAnalysis, setShowBasicAnalysis] = useState(false)
    const [showFlowAnalysis, setShowFlowAnalysis] = useState(false)

    const {graphData, graphManager, isLoading} = useGraphDataManager(
        () => {cytoscapeManager.rerunLayoutAfterRender()},
        ()=> {selectedDataManager.setSelectedElements([])}
    )
    const selectedDataManager = useSelectedDataManager(
        () => {
            setShowBasicAnalysis(false)
            setShowFlowAnalysis(false)
        }
    )
    const cytoscapeManager = useCytoscapeManager()

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner/>}
            <div className={styles.header}>
                <DashboardHeader onSubmitLoadDataPopup={graphManager.loadGraphData}
                                 cytoscapeManager={cytoscapeManager}></DashboardHeader></div>
            <div className={styles.visualizations}>
                <div className={styles.top}>
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
                                showBasicAnalysis={showBasicAnalysis}
                                setShowBasicAnalysis={setShowBasicAnalysis}
                                showFlowAnalysis={showFlowAnalysis}
                                setShowFlowAnalysis={setShowFlowAnalysis}
                            />
                        </div>
                    </div>
                    {showBasicAnalysis &&
                        <div className={styles.basicAnalysis}>
                            <BasicAnalysis selectedDataManager={selectedDataManager} graphData={graphData}></BasicAnalysis>
                        </div>
                    }
                    {showFlowAnalysis &&
                        <div className={styles.basicAnalysis}>
                            <FlowAnalysis
                                cytoscapeManager={cytoscapeManager}
                                selectedDataManager={selectedDataManager}
                                graphData={graphData}>
                            </FlowAnalysis>
                        </div>
                    }
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
