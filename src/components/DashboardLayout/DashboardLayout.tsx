import styles from './DashboardLayout.module.scss'
import {DashboardHeader} from "../DashboardHeader/DashboardHeader";
import {GraphVisualization} from "@/components/GraphVisualization/GraphVisualization";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {useGraphDataManager} from "@/hooks/useGraphDataManager";
import {useCytoscapeManager} from "@/hooks/useCytoscapeManager";
import {DataTable} from "@/components/DataTable/DataTable";
import {useSelectedDataManager} from "@/hooks/useSelectedDataManager";
import {ToolsTab} from "@/components/DetailTab/ToolsTab";
import Divider from "@mui/material/Divider";
import {BasicAnalysis} from "@/components/BasicAnalysis/BasicAnalysis";
import {useState} from "react";
import {FlowAnalysis} from "@/components/FlowAnalysis/FlowAnalysis";
import {PatternAnalysis} from "@/components/PatternAnalysis/PatternAnalysis";
import {AnalysisTab} from "@/types/AnalysisTab";


export default function DashboardLayout() {
    const [showAnalysisTab, setShowAnalysisTab] = useState<AnalysisTab>(AnalysisTab.None);
    const [hideLabels, setHideLabels] = useState(false)
    const [dimElements, setDimElements] = useState(false);

    const {graphData, graphManager, isLoading} = useGraphDataManager(
        () => {
            cytoscapeManager.rerunLayoutAfterRender()
            setHideLabels(false)
        },
        ()=> {selectedDataManager.setSelectedElements([])}
    )
    const selectedDataManager = useSelectedDataManager(
        () => {}
    )
    const cytoscapeManager = useCytoscapeManager()

    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner/>}
            <div className={styles.header}>
                <DashboardHeader hideLabels={hideLabels}
                                 graphManager={graphManager}
                                 setHideLabels={setHideLabels}
                                 dimElements={dimElements}
                                 setDimElements={setDimElements}
                                 selectedDataManager={selectedDataManager}
                                 cytoscapeManager={cytoscapeManager}></DashboardHeader></div>
            <div className={styles.visualizations}>
                <div className={styles.top}>
                    <div className={styles.graph}>
                        <GraphVisualization
                            dimElements={dimElements}
                            setDimElements={setDimElements}
                            cytoscapeManager={cytoscapeManager}
                            hideLabels={hideLabels}
                            setHideLabels={setHideLabels}
                            selectedDataManager={selectedDataManager}
                            graphData={graphData}/>
                        <div className={styles.detailTab}>
                            <ToolsTab
                                graphData={graphData}
                                selectedDataManager={selectedDataManager}
                                graphManager={graphManager}
                                cytoscapeManager={cytoscapeManager}
                                showAnalysisTab={showAnalysisTab}
                                setShowAnalysisTab={setShowAnalysisTab}
                            />
                        </div>
                    </div>
                    {showAnalysisTab == AnalysisTab.Statistics &&
                        <div className={styles.analysis}>
                            <BasicAnalysis
                                selectedDataManager={selectedDataManager}
                                graphData={graphData}>
                            </BasicAnalysis>
                        </div>
                    }
                    {showAnalysisTab == AnalysisTab.FlowAnalysis &&
                        <div className={styles.analysis}>
                            <FlowAnalysis
                                cytoscapeManager={cytoscapeManager}
                                selectedDataManager={selectedDataManager}
                                graphData={graphData}>
                            </FlowAnalysis>
                        </div>
                    }
                    {showAnalysisTab == AnalysisTab.PatternAnalysis &&
                        <div className={styles.analysis}>
                            <PatternAnalysis
                                cytoscapeManager={cytoscapeManager}
                                selectedDataManager={selectedDataManager}
                                setShowAnalysisTab={setShowAnalysisTab}
                                graphData={graphData}>
                            </PatternAnalysis>
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
