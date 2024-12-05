import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './GraphVisualization.module.scss';
import cytoscape from 'cytoscape';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cola from 'cytoscape-cola';
// @ts-ignore
import fcose from 'cytoscape-fcose';
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
import {CompanyNode} from "@/types/CompanyNode";

//cytoscape.use(COSEBilkent);
cytoscape.use( fcose );

type Props = {
    graphData: GraphData,
    selectedDataManager: SelectedDataManager,
    cytoscapeManager: CytoscapeManager
    hideLabels: boolean
    setHideLabels: Dispatch<SetStateAction<boolean>>
};

const EDGE_ID_SEPARATOR= '_'

export function GraphVisualization(props: Props) {

    const cy = props.cytoscapeManager.cy;
    const setSelectedElements = props.selectedDataManager.setSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;
    const subSelectedElements = props.selectedDataManager.subSelectedElements;
    const hideLabels = props.hideLabels
    const setHideLabels = props.setHideLabels

    //TODO: Add feature for box selection and multiple node dragging
    useEffect(() => {
        const stale = cy;
        if (stale == null)
            return;

        const tapHandler = (e: any) => {
            if (e.target === stale) {
                if (selectedElements.length > 0)
                    setSelectedElements([]);
            }
        };

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

        stale.on('click', '*', clickHandler);
        stale.on('tap', tapHandler);
        //stale.on('unselect', '*', unselectHandler);
        return () => {
            stale.off('click', '*', clickHandler);
            stale.off('tap', tapHandler);
            //stale.off('unselect', '*', unselectHandler);
        }
    }, [cy, setSelectedElements, selectedElements, props.graphData])

    const aggregateTransactionEdge = useCallback((edgesGroup: Array<TransactionEdge>, subSelectedIds: Set<string>) => {
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
    }, [])

    useEffect(() => {
        if (hideLabels) {
            cy?.elements().addClass('hideLabels')
        } else {
            cy?.elements().removeClass('hideLabels')
        }
    }, [cy, hideLabels]);

    useEffect(() => {
        const handleKeyDown = (e:any) => {
            if (e.repeat) return; // Do nothing
            if (e.key == 'l') {
                setHideLabels(!hideLabels)
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [cy, setHideLabels, hideLabels]);



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
                        name: edge.name,
                        type: EdgeType.connection,
                        faded: subSelectedIds.size == 0 || subSelectedIds.has(edge.id) ? 'false' : 'true',
                        elementType: ElementType.edge,
                        graphIds: [edge.id],
                    }
                }
            })
        }

        return [...cytoscapeTransactionEdges, ...cytoscapeConnectionEdges]

    }, [aggregateTransactionEdge])

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

    const generateCytoscapeNodes = useCallback((nodes: Array<GraphNode>, subSelectedIds: Set<string>) => {
        const cytoscapeNodes = nodes.map(node => {
            const faded = subSelectedIds.size == 0 || subSelectedIds.has(node.id) ? 'false' : 'true'
            const baseData = {
                id: node.id,
                graphIds: [node.id],
                type: node.type,
                elementType: ElementType.node,
                expanded: node.expanded ? 'true' : 'false',
                faded: faded,
                parent: props.cytoscapeManager.groupByCountry ? (node as any).nationality : undefined
            }

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
        console.log(generateCytoscapeNodes(props.graphData.nodesList, subSelectedIds))
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
            }}
            maxZoom={5}
            minZoom={1}
            stylesheet={CYTOSCAPE_STYLESHEET as any}
            boxSelectionEnabled={true}
        />
    </>;

}
