import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './GraphVisualization.module.scss';
import cytoscape from 'cytoscape';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cola from 'cytoscape-cola';
// @ts-ignore
import {CYTOSCAPE_STYLESHEET} from './CytoscapeStylesheet';
import {CytoscapeManager} from '@/hooks/useCytoscapeManager';
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

cytoscape.use(compoundDragAndDrop);
cytoscape.use(COSEBilkent);

type Props = {
    graphData: GraphData,
    selectedDataManager: SelectedDataManager,
    cytoscapeManager: CytoscapeManager
};

const EDGE_ID_SEPARATOR= '_'

export function GraphVisualization(props: Props) {

    const cy = props.cytoscapeManager.cy;
    const setSelectedElements = props.selectedDataManager.setSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;
    const subSelectedElements = props.selectedDataManager.subSelectedElements;

    useEffect(() => {
        const stale = cy;
        if (stale == null)
            return;

        const tapHandler = (e: any) => {
            if (e.target === stale) {
                setSelectedElements([]);
            }
        };

        const clickHandler = (e: any) => {
            const cytoscapeElement = e.target
            const cytoscapeData = cytoscapeElement.data()
            const type = cytoscapeElement.isNode() ? ElementType.node : ElementType.edge
            const elements = type == ElementType.node ? props.graphData.nodesMap : props.graphData.edgesMap
            const toSelectIds = cytoscapeData['graphIds'] as string[]
            const toSelect = toSelectIds.map(elementId => elements.get(elementId))

            cytoscapeElement.data().manualSelect = true
            if (e.originalEvent.shiftKey && selectedElements.length > 0 && selectedElements[0].elementType == type) {
                if (cytoscapeElement.classes().length > 0) {
                    setSelectedElements(selectedElements.filter(e => !toSelect.some(otherE => otherE.id == e.id)))
                } else {
                    setSelectedElements((oldSelectedElements) => (toSelect as GraphElement[]).concat(oldSelectedElements))
                }
            } else {
                setSelectedElements(toSelect)
            }
        }

        stale.on('click', '*', clickHandler);
        stale.on('tap', tapHandler);
        //stale.on('unselect', '*', unselectHandler);
        return () => {
            stale.off('click', '*', clickHandler);
            stale.off('tap', tapHandler);
            //stale.off('unselect', '*', unselectHandler);
        }
    }, [cy, setSelectedElements, selectedElements, props.graphData])

    const aggregateTransactionEdge = (edgesGroup: Array<TransactionEdge>, subSelectedIds: Set<string>) => {
        const amount = edgesGroup.reduce((amount, edge) => amount = amount + edge.amountPaid, 0)
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
                graphIds: ids
            }
        }
    }

    const generateCytoscapeEdges = useCallback((edges: Array<GraphEdge>, subSelectedIds: Set<string>) => {
        let cytoscapeTransactionEdges = new Array<any>
        let cytoscapeConnectionEdges = new Array<any>
        const edgesByType = Object.groupBy(edges, ({type}) => type);
        const transactionEdges = edgesByType[EdgeType.transaction] as Array<TransactionEdge>
        if (transactionEdges) {
            const transactionsByNodePair = Object.groupBy(transactionEdges, ({
                                                                                 source,
                                                                                 target
                                                                             }) => `${source},${target}`);
            cytoscapeTransactionEdges = (Object.values(transactionsByNodePair) as Array<Array<TransactionEdge>>).map(edge => aggregateTransactionEdge(edge, subSelectedIds))
        }
        const connectionEdges = edgesByType[EdgeType.connection] as Array<ConnectionEdge>
        if (connectionEdges) {
            cytoscapeConnectionEdges = connectionEdges.map(edge => {
                return {
                    data: {
                        id: `${edge.source}${EDGE_ID_SEPARATOR}${edge.target}`,
                        source: edge.source,
                        target: edge.target,
                        type: EdgeType.connection,
                        faded: subSelectedIds.size == 0 || subSelectedIds.has(edge.id) ? 'false' : 'true',
                        elementType: ElementType.edge,
                        graphIds: [edge.id],
                    }
                }
            })
        }

        return [...cytoscapeTransactionEdges, ...cytoscapeConnectionEdges]

    }, [])

    useEffect(() => {
        cy?.elements('node').removeClass('manualNodeSelect')
        cy?.elements('edge').removeClass('manualEdgeSelect')
        if (selectedElements.length > 0) {
            if (selectedElements[0].elementType == ElementType.node) {
                selectedElements.map(e => cy?.$(`#${e.id}`).addClass('manualNodeSelect'))
            } else {
                (selectedElements as GraphEdge[]).map(e => cy?.$(`#${e.source}${EDGE_ID_SEPARATOR}${e.target}`).addClass('manualEdgeSelect'))
            }
        }
    }, [cy, selectedElements]) //TODO: move selected to GraphElement class, update / clear it on setSelected

    const generateCytoscapeNodes = useCallback((nodes: Array<GraphNode>, subSelectedIds: Set<string>) => {
        return nodes.map(node => {
            const faded = subSelectedIds.size == 0 || subSelectedIds.has(node.id) ? 'false' : 'true'
            if (node.type == NodeType.person)
                return {
                    data: { //TODO: refactor this, its duplicated code from return below
                        id: node.id,
                        graphIds: [node.id],
                        type: node.type,
                        elementType: ElementType.node,
                        expanded: node.expanded ? 'true' : 'false',
                        faded: faded,
                        name: (node as PersonNode).name
                    }
                }
            return {data: {id: node.id, graphIds: [node.id], expanded: node.expanded ? 'true' : 'false', faded: faded, type: node.type, elementType: ElementType.node}}
        })
    }, [])

    const cytoscapeGraph = useMemo(() => {
        const subSelectedIds = new Set(subSelectedElements.map(e => e.id))

        return [
            ...generateCytoscapeNodes(props.graphData.nodesList, subSelectedIds),
            ...generateCytoscapeEdges(props.graphData.edgesList, subSelectedIds)
        ]
    }, [props.graphData, generateCytoscapeEdges, generateCytoscapeNodes, subSelectedElements]);

    return <>
        <CytoscapeComponent
            elements={cytoscapeGraph}
            layout={props.cytoscapeManager.layout}
            className={styles.GraphVisualization}
            cy={(cy) => {
                props.cytoscapeManager.setCy(cy)
                cy.autounselectify(true);
                cy.minZoom(1.5)
                cy.maxZoom(14)
            }}
            zoom={2}
            stylesheet={CYTOSCAPE_STYLESHEET as any}
        />
    </>;

}
