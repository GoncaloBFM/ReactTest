import styles from "@/components/PatternAnalysis/PatternAnalysis.module.scss";
import RefreshIcon from '@mui/icons-material/Refresh';
import React, {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {Card, CardContent, CardHeader, ListItemButton, ListItemIcon, Stack, Typography} from "@mui/material";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import Image from "next/image";
import scatterGatherSourceIcon from "../../../public/scatter-source.svg";
import scatterGatherTargetIcon from "../../../public/scatter-target.svg";
import statsIcon from "../../../public/stats.svg";
import {EdgeType} from "@/types/EdgeType";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {CytoscapeManager} from "@/hooks/useCytoscapeManager";
import {ElementType} from "@/types/ElementType";
import {CollectionReturnValue, EdgeSingular, NodeSingular} from "cytoscape";
import {GraphNode} from "@/types/GraphNode";
import {GraphData} from "@/types/GraphData";
import {sum} from "@/utils/math";
import {AnalysisTab} from "@/types/AnalysisTab";

type Props = {
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphData: GraphData
    setShowAnalysisTab: Dispatch<SetStateAction<AnalysisTab>>
}

type ScatterGatherPath = {
    endNode: NodeSingular,
    firstEdge: EdgeSingular,
    intermediateNode: NodeSingular,
    secondEdge: EdgeSingular
}


export function PatternAnalysis(props: Props) {
    const setShowAnalysisTab = props.setShowAnalysisTab
    const cytoscapeManager = props.cytoscapeManager
    const graphData = props.graphData
    const selectedDataManager = props.selectedDataManager

    const generateListItem = useCallback((key:string, primaryText: string, secondaryText: string, cytoscapeEdgeIds: string[], edgeIds: string[], icon: any) => {
        return <ListItemButton key={key}
                               onMouseEnter={()=> {
                                   cytoscapeManager.cy?.startBatch()
                                   cytoscapeEdgeIds.map(elementId => cytoscapeManager.addElementHighlight(elementId))
                                   cytoscapeManager.cy?.endBatch()
                               }}
                               onMouseLeave={() => {
                                   cytoscapeManager.cy?.startBatch()
                                   cytoscapeEdgeIds.map(elementId => cytoscapeManager.removeElementHighlight(elementId))
                                   cytoscapeManager.cy?.endBatch()
                               }}
                               onClick={()=>{
                                   cytoscapeManager.cy?.startBatch()
                                   cytoscapeEdgeIds.map(elementId => cytoscapeManager.removeElementHighlight(elementId))
                                   cytoscapeManager.cy?.endBatch()
                                   selectedDataManager.setSelectedElements(edgeIds.map(edgeId => graphData.edgesMap.get(edgeId)))
                                   setShowAnalysisTab(AnalysisTab.FlowAnalysis)
                               }}
        >
            <ListItemIcon>
                <Image src = {icon} alt = '' className = {styles.pattern} />
            </ListItemIcon>
            <ListItemText primary={primaryText} secondary={secondaryText} />
        </ListItemButton>
    }, [cytoscapeManager, graphData.edgesMap, selectedDataManager, setShowAnalysisTab])

    const SearchScatterGatherSource = useCallback((root: GraphNode) => {
        const matches = new Array<ScatterGatherPath>()
        const outgoing = cytoscapeManager.cy?.elements(`#${root.id}`).outgoers().filter(e => e.data().type == EdgeType.transaction) as CollectionReturnValue
        outgoing.forEach((firstEdge: EdgeSingular) => {
            firstEdge
                .target()
                .outgoers()
                .filter(secondEdge => secondEdge.data().type == EdgeType.transaction && secondEdge.data().amountPaid == firstEdge.data().amountPaid).forEach(
                matchingSecondEdge => {
                    matches.push({
                        endNode: matchingSecondEdge.target(),
                        secondEdge: matchingSecondEdge,
                        intermediateNode: matchingSecondEdge.source(),
                        firstEdge: firstEdge
                    })
                }
            )
        })

        const groups = Object.groupBy(matches, p => p.endNode.id()) as Record<string, Array<ScatterGatherPath>>
        return Object.keys(groups).map(nodeId => {
            const totalFlow = sum(groups[nodeId].map(p => p.secondEdge.data().amountPaid))
            const nEntities = groups[nodeId].length + 2
            const cytoscapeEdgeIds = groups[nodeId].map(p => [p.secondEdge.id(), p.firstEdge.id()]).flat()
            const edgeIds = groups[nodeId].map(p => [p.secondEdge.data().graphIds, p.firstEdge.data().graphIds]).flat(2)
            return generateListItem(nodeId, "Scatter gather (source)", `Total flow: ${totalFlow} USD Number of entities: ${nEntities}`, cytoscapeEdgeIds, edgeIds, scatterGatherSourceIcon)
        })
    },[cytoscapeManager, generateListItem])

    const searchScatterGatherTarget = useCallback((root: GraphNode) => {
        const matches = new Array<ScatterGatherPath>()
        const incoming = cytoscapeManager.cy?.elements(`#${root.id}`).incomers().filter(e => e.data().type == EdgeType.transaction) as CollectionReturnValue
        incoming.forEach((firstEdge: EdgeSingular) => {
            firstEdge
                .sources()
                .incomers()
                .filter(secondEdge => secondEdge.data().type == EdgeType.transaction && secondEdge.data().amountPaid == firstEdge.data().amountPaid).forEach(
                matchingSecondEdge => {
                    matches.push({
                        endNode: matchingSecondEdge.source(),
                        secondEdge: matchingSecondEdge,
                        intermediateNode: matchingSecondEdge.source(),
                        firstEdge: firstEdge
                    })
                }
            )
        })

        const groups = Object.groupBy(matches, p => p.endNode.id()) as Record<string, Array<ScatterGatherPath>>
        return Object.keys(groups).map(nodeId => {
            const totalFlow = sum(groups[nodeId].map(p => p.secondEdge.data().amountPaid))
            const nEntities = groups[nodeId].length + 2
            const cytoscapeEdgeIds = groups[nodeId].map(p => [p.secondEdge.id(), p.firstEdge.id()]).flat()
            const edgeIds = groups[nodeId].map(p => [p.secondEdge.data().graphIds, p.firstEdge.data().graphIds]).flat(2)
            return generateListItem(nodeId, "Scatter gather (target)", `Total flow: ${totalFlow} USD Number of entities: ${nEntities}`, cytoscapeEdgeIds, edgeIds, scatterGatherTargetIcon)
        })
    },[cytoscapeManager, generateListItem])

    const analysis = useMemo(() => {
        const data = selectedDataManager.subSelectedElements.length > 0 ? selectedDataManager.subSelectedElements : selectedDataManager.selectedElements
        if (!(data.length == 1 && data[0].elementType == ElementType.node)) {
            return <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} className={styles.error}><Typography variant={'subtitle1'} align={'center'}>Select one entity to analyse</Typography></Stack>
        }
        const root = data[0] as GraphNode
        const allResults = SearchScatterGatherSource(root).concat(searchScatterGatherTarget(root))
        if (allResults.length == 0) {
            return <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} className={styles.error}><Typography variant={'subtitle1'} align={'center'}>No patterns found</Typography></Stack>
        }

        return <List>
            {allResults}
        </List>
    }, [SearchScatterGatherSource, selectedDataManager.selectedElements, selectedDataManager.subSelectedElements, searchScatterGatherTarget])

    return(
        <Card className = {styles.PatternAnalysis} elevation={0}>
            <CardHeader avatar = {<Image src = {statsIcon} alt = '' className = {styles.titleImage} />}
                        title = {'Pattern analysis'}
            />
            <CardContent className={styles.analysisBody}>
                {analysis}
            </CardContent>
        </Card>
    )
}
