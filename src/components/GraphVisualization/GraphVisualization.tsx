import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './GraphVisualization.module.scss';
import cytoscape, {NodeSingular} from 'cytoscape';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cola from 'cytoscape-cola';
// @ts-ignore
import fcose from 'cytoscape-fcose';
import cytoscapePopper, {PopperInstance} from 'cytoscape-popper';
// @ts-ignore
import {CYTOSCAPE_STYLESHEET} from './CytoscapeStylesheet';
import {CytoscapeManager, useCytoscapeManager} from '@/hooks/useCytoscapeManager';
import {GraphData} from "@/types/GraphData";
import {GraphNode, NodeMetadata} from "@/types/GraphNode";
import {GraphEdge} from "@/types/GraphEdge";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {ConnectionEdge} from "@/types/ConnectionEdge";
import {GraphElement} from "@/types/GraphElement";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {PersonNode} from "@/types/PersonNode";
// @ts-ignore
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {CompanyNode} from "@/types/CompanyNode";
import {useSafeState} from "react-query/types/devtools/utils";
import {SafeMap} from "@/utils/SafeMap";

cytoscape.use( fcose );

type Props = {
    graphData: GraphData,
    selectedDataManager: SelectedDataManager,
    cytoscapeManager: CytoscapeManager
    hideLabels: boolean
    setHideLabels: Dispatch<SetStateAction<boolean>>
    dimElements: boolean
    setDimElements: Dispatch<SetStateAction<boolean>>
    showFlow: boolean
    setShowFlow: Dispatch<SetStateAction<boolean>>
};

type FlowValues = {
    in: SafeMap<string, number>
    out: SafeMap<string, number>
}

const EDGE_ID_SEPARATOR= '_'

export function GraphVisualization(props: Props) {

    const cy = props.cytoscapeManager.cy;
    const cytoscapeManager =props.cytoscapeManager;
    const setSelectedElements = props.selectedDataManager.setSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;
    const subSelectedElements = props.selectedDataManager.subSelectedElements;
    const hideLabels = props.hideLabels
    const setHideLabels = props.setHideLabels
    const dimElements = props.dimElements
    const setShowFlow = props.setShowFlow
    const showFlow = props.showFlow

    //TODO: Add feature for box selection and multiple node dragging
    useEffect(() => {
        const stale = cy;
        if (stale == null)
            return;

        const tapHandler = (e: any) => {
            if (e.target === stale) {
                if (e.originalEvent.shiftKey) {
                    return
                }
                if (selectedElements.length > 0)
                    setSelectedElements([]);
            }
        };

        const mouseInHandler = (e:any) => {
            if (!dimElements || subSelectedElements.length > 0) {
                return
            }
            const element = e.target
            const neighborIds = element.isNode() ? (element as NodeSingular).neighborhood().map(e => e.id()) : [element.source().id(), element.target().id()]
            const allIds = new Set(neighborIds.concat([element.id()]))
            cy?.startBatch()
            cy?.elements().forEach(
                e => {
                    if (!allIds.has(e.id())) {
                        e.addClass('dimmedElement')
                    }}
            )
            cy?.endBatch()
        }


        const mouseOutHandler = (e:any) => {
            if (!dimElements) {
                return
            }
            cy?.elements().removeClass('dimmedElement')
        }

        const clickHandler = (e: any) => {
            const cytoscapeElement = e.target
            const cytoscapeData = cytoscapeElement.data()
            const type = cytoscapeElement.isNode() ? ElementType.node : ElementType.edge
            const elements = type == ElementType.node ? props.graphData.nodesMap : props.graphData.edgesMap
            const toSelectIds = ((cytoscapeData.type == 'compound') ? cytoscapeElement.children().map((e: any) => e.id()) : cytoscapeData['graphIds']) as string []
            const toSelect = toSelectIds.map(elementId => elements.get(elementId))

            if (e.originalEvent.shiftKey && selectedElements.length > 0 && selectedElements[0].elementType == type) {
                if (cytoscapeElement.hasClass('manualNodeSelect') || cytoscapeElement.hasClass('manualEdgeSelect')) {
                    setSelectedElements(selectedElements.filter(e => !toSelect.some(otherE => otherE.id == e.id)))
                } else {
                    setSelectedElements((oldSelectedElements) => (toSelect as GraphElement[]).concat(oldSelectedElements))
                }
            } else {
                setSelectedElements(toSelect)
            }
        }


        stale.on('mouseover', '*', mouseInHandler)
        stale.on('mouseout', '*', mouseOutHandler)
        stale.on('click', '*', clickHandler);
        stale.on('tap', tapHandler);
        //stale.on('unselect', '*', unselectHandler);
        return () => {
            stale.off('click', '*', clickHandler);
            stale.off('tap', tapHandler);
            stale.off('mouseover', '*', mouseInHandler)
            stale.off('mouseout', '*', mouseOutHandler)
            //stale.off('unselect', '*', unselectHandler);
        }
    }, [cy, setSelectedElements, cytoscapeManager.poppers, selectedElements, props.graphData, subSelectedElements, dimElements])

    const aggregateTransactionEdge = useCallback((edgesGroup: Array<TransactionEdge>, subSelectedIds: Set<string>, flowValues:FlowValues|undefined) => {
        const amount = edgesGroup.reduce((amount, edge) => {
            if (flowValues != undefined) {
                if (!flowValues.out.has(edge.source)) {
                    flowValues.out.set(edge.source, edge.amountPaid)
                } else {
                    flowValues.out.set(edge.source, flowValues.out.get(edge.source) + edge.amountPaid)
                }

                if (!flowValues.in.has(edge.target)) {
                    flowValues.in.set(edge.target, edge.amountPaid)
                } else {
                    flowValues.in.set(edge.target, flowValues.in.get(edge.target) + edge.amountPaid)
                }
            }
            return amount + edge.amountPaid
        }, 0)
        const label = `( ${amount.toFixed(2)} USD | ${edgesGroup.length} )`
        const ids = edgesGroup.map(edge => edge.id)

        return {
            data: {
                id: `${edgesGroup[0].source}${EDGE_ID_SEPARATOR}${edgesGroup[0].target}`,
                source: edgesGroup[0].source,
                target: edgesGroup[0].target,
                type: EdgeType.transaction,
                faded: subSelectedIds.size == 0 || subSelectedIds.intersection(new Set(ids)).size > 0 ? 'false' : 'true',
                elementType: ElementType.edge,
                label: label,
                amountPaid: amount,
                graphIds: ids,
                opacity:1
            }
        }
    }, [])

    useEffect(() => {
        if (hideLabels) {
            cy?.elements().addClass('hideLabels')
        } else {
            cy?.elements().removeClass('hideLabels')
        }
    }, [cy, hideLabels]);

    useEffect(() => {
        if (showFlow) {
            cy?.elements().addClass('showFlow')
        } else {
            cy?.elements().removeClass('showFlow')
        }
    }, [cy, showFlow]);

    useEffect(() => {
        const handleKeyDown = (e:any) => {
            if (e.repeat) return; // Do nothing
            if (e.key == 'l' || e.key == 'L') {
                setHideLabels(!hideLabels)
            }
            if (e.key == 'p' || e.key == 'P') {
                setShowFlow(!showFlow)
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [cy, setHideLabels, hideLabels, setShowFlow, showFlow]);

    const calculateFlow = (nodeId: string, nodePieValues: FlowValues | undefined, maxFlow: number) => {
        if (nodePieValues != undefined) {
            const inValue = nodePieValues.in.has(nodeId) ? nodePieValues.in.get(nodeId) : 0
            const outValue = nodePieValues.out.has(nodeId) ? nodePieValues.out.get(nodeId) : 0
            if (inValue == 0 && outValue == 0) {
                return {pieIn: 0, pieOut: 0, noPie: 100, opacity: .05}
            }
            const outPercentage = (outValue / (inValue + outValue)) * 100
            return {pieIn: 100 - outPercentage, pieOut: outPercentage, noPie: 0, opacity: Math.max(0.05, (inValue + outValue) / maxFlow)}
        }
        return {}
    }

    const generateCytoscapeEdges = useCallback((edges: Array<GraphEdge>, subSelectedIds: Set<string>, nodePieValues: FlowValues | undefined) => {
        let cytoscapeTransactionEdges = new Array<any>
        let cytoscapeConnectionEdges = new Array<any>
        const edgesByType = Object.groupBy(edges, ({type}) => type);
        const transactionEdges = edgesByType[EdgeType.transaction] as Array<TransactionEdge>
        if (transactionEdges) {
            const transactionsByNodePair = Object.groupBy(transactionEdges, ({
                                                                                 source,
                                                                                 target
                                                                             }) => `${source},${target}`);
            cytoscapeTransactionEdges = (Object.values(transactionsByNodePair) as Array<Array<TransactionEdge>>).map(edge => aggregateTransactionEdge(edge, subSelectedIds, nodePieValues))

            if (showFlow) {
                const maxEdge = cytoscapeTransactionEdges.reduce((previousValue, edge) => {
                    return Math.max(previousValue, edge.data.amountPaid)
                }, 0)
                cytoscapeTransactionEdges.forEach(edge => {
                    edge.data.opacity = Math.max(0.05, edge.data.amountPaid / maxEdge)
                })
            }
        }
        const connectionEdges = edgesByType[EdgeType.connection] as Array<ConnectionEdge>
        if (connectionEdges) {
            cytoscapeConnectionEdges = connectionEdges.map(edge => {
                return {
                    data: {
                        id: `${edge.source}${EDGE_ID_SEPARATOR}${edge.target}`,
                        source: edge.source,
                        target: edge.target,
                        name: edge.name,
                        opacity: 0.05,
                        type: EdgeType.connection,
                        faded: subSelectedIds.size == 0 || subSelectedIds.has(edge.id) ? 'false' : 'true',
                        elementType: ElementType.edge,
                        graphIds: [edge.id],
                    }
                }
            })
        }

        return [...cytoscapeTransactionEdges, ...cytoscapeConnectionEdges]

    }, [aggregateTransactionEdge, showFlow])

    useEffect(() => {
        cy?.startBatch()
        cy?.elements('node').removeClass('manualNodeSelect')
        cy?.elements('edge').removeClass('manualEdgeSelect')
        if (selectedElements.length > 0) {
            if (selectedElements[0].elementType == ElementType.node) {
                selectedElements.map(e => cy?.$(`#${e.id}`).addClass('manualNodeSelect'))
            } else {
                (selectedElements as GraphEdge[]).map(e => cy?.$(`#${e.source}${EDGE_ID_SEPARATOR}${e.target}`).addClass('manualEdgeSelect'))
            }
        }
        cy?.endBatch()
    }, [cy, selectedElements]) //TODO: move selected to GraphElement class, update / clear it on setSelected

    const generateCytoscapeNodes = useCallback((nodes: Array<GraphNode>, subSelectedIds: Set<string>, flowValues: FlowValues | undefined) => {
        const maxFlow = flowValues == undefined ? 0 : nodes.reduce((previousValue, node) => {
            let total = 0
            if (flowValues.in.has(node.id)) {
                total += flowValues.in.get(node.id)
            }
            if (flowValues.out.has(node.id)) {
                total += flowValues.out.get(node.id)
            }
            return Math.max(previousValue, total)
        }, 0)

        const cytoscapeNodes = nodes.map(node => {
            const faded = subSelectedIds.size == 0 || subSelectedIds.has(node.id) ? 'false' : 'true'

            const baseData = Object.assign({
                id: node.id,
                graphIds: [node.id],
                type: node.type,
                elementType: ElementType.node,
                expanded: node.expanded ? 'true' : 'false',
                faded: faded,
                parent: props.cytoscapeManager.groupByCountry ? (node as any).nationality : undefined
            }, calculateFlow(node.id, flowValues, maxFlow))

            if (node.type == NodeType.person)
                return {data: Object.assign(baseData, {name: (node as PersonNode).name})}
            else  if (node.type == NodeType.account)
                return {data: baseData}
            else if (node.type == NodeType.company) {
                return {data: Object.assign(baseData, {name: (node as CompanyNode).name})}
            }
            else
                throw new Error(`Unknown node type ${node.type}`)
        })

        if (props.cytoscapeManager.groupByCountry) {
            new Set(nodes.map((n: any)=> n.nationality)).forEach(e => {
                if (e != undefined) {
                    cytoscapeNodes.push({data: {id: e, type: 'compound'}} as any)
                }
            })
        }
        return cytoscapeNodes
    }, [props.cytoscapeManager.groupByCountry])

    const cytoscapeGraph = useMemo(() => {
        const subSelectedIds = new Set(subSelectedElements.map(e => e.id))
        const flowValues = showFlow ? {out: new SafeMap<string, number>(), in: new SafeMap<string, number>()} : undefined
        const edges = generateCytoscapeEdges(props.graphData.edgesList, subSelectedIds, flowValues)
        const nodes = generateCytoscapeNodes(props.graphData.nodesList, subSelectedIds, flowValues)
        return [
            ...nodes, ...edges
        ]
    }, [props.graphData, generateCytoscapeEdges, generateCytoscapeNodes, subSelectedElements, showFlow]);

    return <>
        <CytoscapeComponent
            elements={cytoscapeGraph}
            className={styles.GraphVisualization}
            cy={(cy) => {
                props.cytoscapeManager.setCy(cy)
            }}
            maxZoom={5}
            minZoom={1}
            stylesheet={CYTOSCAPE_STYLESHEET as any}
            boxSelectionEnabled={true}
        />
    </>;

}
