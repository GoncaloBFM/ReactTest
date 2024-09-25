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

cytoscape.use(compoundDragAndDrop);
cytoscape.use(COSEBilkent);

type Props = {
  graphData: GraphData,
  setSelectElements: SetStateAction<any>,
  selectedElements: Array<any>
  manager: CytoscapeManager
};

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
        setSelectElements(new Array<GraphElement>());
      }
    };

    const nodeClickHandler = (e: any) => {
      const cytoscapeData = e.target.data()
      setSelectElements(props.graphData.nodes.filter(node => node.id == cytoscapeData.id))
    };

    const edgeClickHandler = (e: any) => {
      const cytoscapeData = e.target.data()
      setSelectElements(props.graphData.nodes.filter(node => node.id == cytoscapeData.id))
      setSelectElements(props.graphData.edges.filter(edge => cytoscapeData.ids.includes(edge.id)))
    };

    stale.on('tap', tapHandler);
    stale.on('click', 'node', nodeClickHandler);
    stale.on('click', 'edge', edgeClickHandler);
    // clean up
    return () => {
      stale.off('tap', tapHandler);
      stale.off('click', 'node', nodeClickHandler);
      stale.off('click', 'edge', edgeClickHandler);
    }
  }, [cy, setSelectElements, props.graphData.nodes, props.graphData.edges, props.selectedElements])

  const aggregateTransactionEdge = (edgesGroup: Array<TransactionEdge>) => {
    const amount = edgesGroup.reduce((amount,edge) =>  amount = amount + edge.amountPaid, 0 )
    const label = `| # ${edgesGroup.length} | ${amount.toFixed(2)} USD |`
    const ids = edgesGroup.map(edge => edge.id)

    return { data: {source: edgesGroup[0].source, target: edgesGroup[0].target, type: EdgeType.transaction, elementType: ElementType.edge, label:label, ids:ids}}
  }

  const generateCytoscapeEdges = useCallback((edges: Array<GraphEdge>) => {
    let cytoscapeTransactionEdges = new Array<any>
    let cytoscapeConnectionEdges = new Array<any>
    const edgesByType = Object.groupBy(edges, ({type}) => type);
    const transactionEdges = edgesByType[EdgeType.transaction] as Array<TransactionEdge>
    if (transactionEdges) {
      const transactionsByNodePair = Object.groupBy(transactionEdges, ({source, target}) => `${source},${target}`);
      cytoscapeTransactionEdges = (Object.values(transactionsByNodePair) as Array<Array<TransactionEdge>>).map(aggregateTransactionEdge)
    }

    const connectionEdges = edgesByType[EdgeType.connection] as Array<ConnectionEdge>
    if (connectionEdges) {
      cytoscapeConnectionEdges = connectionEdges.map(edge => {
        return {data: {source: edge.source, target: edge.target, type: EdgeType.connection, elementType: ElementType.edge, ids: [edge.id]}}
      })
    }

    return [...cytoscapeTransactionEdges, ...cytoscapeConnectionEdges]

  }, [])

  const generateCytoscapeNodes = useCallback((nodes: Array<GraphNode>) => {
    return nodes.map(node => {
      if (node.type == NodeType.person)
        return {data: {id: node.id, type:node.type, elementType:ElementType.node, name: (node as PersonNode).name}} //TODO: implement a node to cytoscape node translator
      return {data: {id: node.id, type:node.type, elementType:ElementType.node}}
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
        cy={(cy) => props.manager.setCy(cy)}
        zoom={2}
        stylesheet={CYTOSCAPE_STYLESHEET as any}
    />
  </>;

}
