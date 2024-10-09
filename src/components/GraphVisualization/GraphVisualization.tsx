import React, {SetStateAction, useCallback, useEffect, useMemo} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './GraphVisualization.module.scss';
import cytoscape from 'cytoscape';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
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
import {Exception} from "sass";
import {string} from "prop-types";

cytoscape.use(compoundDragAndDrop);
cytoscape.use(COSEBilkent);

type Props = {
    graphData: GraphData,
    setSelectElements: SetStateAction<any>,
    selectedElements: Array<any>
    manager: CytoscapeManager
};

const EDGE_ID_SEPARATOR= '_'

export function GraphVisualization(props: Props) {

    const cy = props.manager.cy;
    const setSelectElements = props.setSelectElements;
    const selectedElements = props.selectedElements;

    useEffect(() => {
        const stale = cy;
        if (stale == null)
            return;

        const tapHandler = (e: any) => {
            if (e.target === stale) {
                setSelectElements([]);
            }
        };

        const clickHandler = (e: any) => {
            const cytoscapeElement = e.target
            const cytoscapeData = cytoscapeElement.data()
            const type = cytoscapeElement.isNode() ? ElementType.node : ElementType.edge
            const elements = type == ElementType.node ? props.graphData.nodes : props.graphData.edges
            const toSelectIds = cytoscapeData['graphIds'] as string[]
            const toSelect = elements.filter(e => toSelectIds.some(otherId => otherId ==e.id))

            cytoscapeElement.data().manualSelect = true
            if (e.originalEvent.shiftKey && selectedElements.length > 0 && selectedElements[0].elementType == type) {
                if (cytoscapeElement.classes().length > 0) {
                    setSelectElements(selectedElements.filter(e => !toSelect.some(otherE => otherE.id == e.id)))
                } else {
                    setSelectElements(toSelect.concat(selectedElements))
                }
            } else {
                setSelectElements(toSelect)
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
    }, [cy, setSelectElements, selectedElements, props.graphData.nodes, props.graphData.edges, props.selectedElements])

    const aggregateTransactionEdge = (edgesGroup: Array<TransactionEdge>) => {
        const amount = edgesGroup.reduce((amount, edge) => amount = amount + edge.amountPaid, 0)
        const label = `( # ${edgesGroup.length} | ${amount.toFixed(2)} USD )`
        const ids = edgesGroup.map(edge => edge.id)

        return {
            data: {
                id: `${edgesGroup[0].source}${EDGE_ID_SEPARATOR}${edgesGroup[0].target}`,
                source: edgesGroup[0].source,
                target: edgesGroup[0].target,
                type: EdgeType.transaction,
                elementType: ElementType.edge,
                label: label,
                graphIds: ids
            }
        }
    }

    const generateCytoscapeEdges = useCallback((edges: Array<GraphEdge>) => {
        let cytoscapeTransactionEdges = new Array<any>
        let cytoscapeConnectionEdges = new Array<any>
        const edgesByType = Object.groupBy(edges, ({type}) => type);
        const transactionEdges = edgesByType[EdgeType.transaction] as Array<TransactionEdge>
        if (transactionEdges) {
            const transactionsByNodePair = Object.groupBy(transactionEdges, ({
                                                                                 source,
                                                                                 target
                                                                             }) => `${source},${target}`);
            cytoscapeTransactionEdges = (Object.values(transactionsByNodePair) as Array<Array<TransactionEdge>>).map(aggregateTransactionEdge)
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
                selectedElements.map(e => cy?.$(`#${e.source}${EDGE_ID_SEPARATOR}${e.target}`).addClass('manualEdgeSelect'))
            }
        }
    }, [cy, selectedElements])

    const generateCytoscapeNodes = useCallback((nodes: Array<GraphNode>) => {
        return nodes.map(node => {
            if (node.type == NodeType.person)
                return {
                    data: {
                        id: node.id,
                        graphIds: [node.id],
                        type: node.type,
                        elementType: ElementType.node,
                        expanded: node.expanded ? 'true' : 'false',
                        name: (node as PersonNode).name
                    }
                }
            return {data: {id: node.id, graphIds: [node.id], expanded: node.expanded ? 'true' : 'false', type: node.type, elementType: ElementType.node}}
        })
    }, [])

    const cytoscapeGraph = useMemo(() => {
        // TODO: this runs twice for some reason
        // TODO: we need specific cytoscape types to ensure stuff is safe
        return [
            ...generateCytoscapeNodes(props.graphData.nodes),
            ...generateCytoscapeEdges(props.graphData.edges)
        ]
    }, [props.graphData, generateCytoscapeEdges, generateCytoscapeNodes]);

    return <>
        <CytoscapeComponent
            elements={cytoscapeGraph}
            layout={props.manager.layout}
            className={styles.GraphVisualization}
            cy={(cy) => {
                props.manager.setCy(cy)
                cy.autounselectify(true);
                cy.boxSelectionEnabled(true);
            }}
            zoom={2}
            stylesheet={CYTOSCAPE_STYLESHEET as any}
        />
    </>;

}
