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
import {useEffect, useState} from "react";
import {FlowAnalysis} from "@/components/FlowAnalysis/FlowAnalysis";
import {PatternAnalysis} from "@/components/PatternAnalysis/PatternAnalysis";


export default function DashboardLayout() {
    const [showBasicAnalysis, setShowBasicAnalysis] = useState(false)
    const [showFlowAnalysis, setShowFlowAnalysis] = useState(false)
    const [showPatternAnalysis, setShowPatternAnalysis] = useState(false)
    const [hideLabels, setHideLabels] = useState(false)

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


    useEffect(() => {
        const handleKeyDown = (e:any) => {
            if (e.repeat) return; // Do nothing
            if (e.key == 'Escape') {
                setShowBasicAnalysis(false)
                setShowFlowAnalysis(false)
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, []);


    return (
        <div className={styles.DashboardLayout}>
            {isLoading && <LoadingSpinner/>}
            <div className={styles.header}>
                <DashboardHeader hideLabels={hideLabels}
                                 graphManager={graphManager}
                                 setHideLabels={setHideLabels}
                                 selectedDataManager={selectedDataManager}
                                 cytoscapeManager={cytoscapeManager}></DashboardHeader></div>
            <div className={styles.visualizations}>
                <div className={styles.top}>
                    <div className={styles.graph}>
                        <GraphVisualization
                            cytoscapeManager={cytoscapeManager}
                            hideLabels={hideLabels}
                            setHideLabels={setHideLabels}
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
                                setShowPatternAnalysis={setShowPatternAnalysis}
                                showPatternAnalysis={showPatternAnalysis}
                            />
                        </div>
                    </div>
                    {showBasicAnalysis &&
                        <div className={styles.analysis}>
                            <BasicAnalysis
                                selectedDataManager={selectedDataManager}
                                graphData={graphData}>
                            </BasicAnalysis>
                        </div>
                    }
                    {showFlowAnalysis &&
                        <div className={styles.analysis}>
                            <FlowAnalysis
                                cytoscapeManager={cytoscapeManager}
                                selectedDataManager={selectedDataManager}
                                graphData={graphData}>
                            </FlowAnalysis>
                        </div>
                    }
                    {showPatternAnalysis &&
                        <div className={styles.analysis}>
                            <PatternAnalysis
                                cytoscapeManager={cytoscapeManager}
                                selectedDataManager={selectedDataManager}
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
