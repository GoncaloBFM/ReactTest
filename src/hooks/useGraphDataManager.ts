import {SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {SERVER_URL} from "@/app/definitions";
import {GraphEdge} from "@/types/GraphEdge";
import {GraphNode} from "@/types/GraphNode";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {ConnectionEdge} from "@/types/ConnectionEdge";
import {elementType} from "prop-types";
import {HTMLElementType} from "@mui/utils";
import {ElementType} from "@/types/ElementType";
import {NodeType} from "@/types/NodeType";
import {PersonNode} from "@/types/PersonNode";
import {AccountNode} from "@/types/AccountNode";

export type GraphManager = {
    expandNodeData: (nodeIds: Array<string>) => void,
    removeNodeData: (nodeIds: Array<string>) => void,
    loadGraphData: (nodeIds: Array<string>) => void,
    removeEdgeData: (nodeIds: Array<string>) => void
}

export function useGraphDataManager() {
    const [isLoading, setIsLoading] = useState(false); //TODO: this

    const [graphData, setGraphData] = useState(
        {nodes: new Array<GraphNode>, edges: new Array<GraphEdge>}
    );

    const [dataFields, setDataFields] = useState(
        {
            [NodeType.person]: ['country','address','birthDate'],
            [NodeType.account]: [],
            [EdgeType.transaction]: [],
            [EdgeType.connection]: []
        }
    )

    const parseRawEdge = useCallback((rawEdge: {[key:string]: string}) => {
        if (rawEdge['type'] == EdgeType.transaction) {
            return new TransactionEdge(
                rawEdge['source'],
                rawEdge['target'],
                rawEdge['id'],
                parseFloat(rawEdge['amountPaid']),
                rawEdge['currencyPaid'],
                Object.fromEntries(dataFields.transaction.map((k:string) => [k, rawEdge[k]])),
                parseFloat(rawEdge['timestamp']),
            )
        }

        if (rawEdge['type'] == EdgeType.connection)
            return new ConnectionEdge(
                rawEdge['source'],
                rawEdge['target'],
                rawEdge['id'],
                Object.fromEntries(dataFields.connection.map((k:string) => [k, rawEdge[k]])),
            )

        throw new Error(`Unknown edge type ${rawEdge['type']}`)
    }, [])

    const parseRawNode = useCallback((rawNode: {[key:string]: string}): GraphNode => {
        if (rawNode['type'] == NodeType.person)
            return new PersonNode(
                rawNode['id'],
                rawNode['name'],
                Object.fromEntries(dataFields.person.map((k:string) => [k, rawNode[k]])),
            );

        if (rawNode['type'] == NodeType.account)
            return new AccountNode(
                rawNode['id'],
                Object.fromEntries(dataFields.account.map((k:string) => [k, rawNode[k]]))
            );

        throw new Error(`Unknown node type ${rawNode['type']}`)
    }, [])

    const expandNodeData = useMemo(() => {
        return async (nodeIds: Array<string>) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/neighbors/${nodeIds.join(',')}`)
            const [rawNeighborNodes, rawNeighborEdges] = await response.json();
            const newNeighborNodes = rawNeighborNodes.map(parseRawNode)
            const newNeighborEdges = rawNeighborEdges.map(parseRawEdge)
            const neighborNodes = newNeighborNodes.concat(graphData.nodes.filter((a: GraphNode) => !newNeighborNodes.some((b: GraphNode) => b.id === a.id)))
            const neighborEdges = newNeighborEdges.concat(graphData.edges.filter((a: GraphEdge) => !newNeighborEdges.some((b: GraphEdge) => b.id === a.id)))
            graphData.nodes.filter((node: GraphNode) => nodeIds.some(nodeId=> node.id === nodeId)).forEach(
                node => node.expanded = true
            ) //TODO: seems to be buggy because it laods existing data again
            setGraphData({
                nodes: neighborNodes,
                edges: neighborEdges
            })
            setIsLoading(false);
        };
    }, [setGraphData, graphData, setIsLoading, parseRawNode, parseRawEdge]);

    const removeNodeData = (nodeIds: Array<string>) => { //TODO: clear not expanded flag on neighbor nodes
        const newNodes = graphData.nodes.filter((node: GraphNode) => !nodeIds.some(nodeId => nodeId == node.id))
        const newEdges = graphData.edges.filter((edge: GraphEdge) => !nodeIds.some(nodeId => nodeId == edge.source || nodeId == edge.target))
        setGraphData({
            nodes: newNodes,
            edges: newEdges
        })
    };

    const removeEdgeData = (edgeIds: Array<string>) => { //TODO: clear not expanded flag on neighbor nodes
        const newEdges = graphData.edges.filter((edge: GraphEdge) => !edgeIds.some(nodeId => nodeId == edge.id))
        setGraphData({
            nodes: graphData.nodes,
            edges: newEdges
        })
    };

    const loadGraphData = useMemo(() => {
        return async (nodeIds: string[]) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/graph/${nodeIds.join(',')}`)
            const [rawNodes, rawEdges] = await response.json();
            const newNodes = rawNodes.map(parseRawNode)
            const newEdges = rawEdges.map(parseRawEdge)
            const nodes = newNodes.concat(graphData.nodes.filter((a: GraphNode) => !newNodes.some((b: GraphNode) => b.id === a.id)))
            const edges = newEdges.concat(graphData.edges.filter((a: GraphEdge) => !newEdges.some((b: GraphEdge) => b.id === a.id)))
            setGraphData({
                nodes: nodes,
                edges: edges
            })
            setIsLoading(false);
        };
    }, [setGraphData, setIsLoading, parseRawNode, parseRawEdge, graphData]);

    return {
        graphManager: {
            expandNodeData,
            removeNodeData,
            loadGraphData,
            removeEdgeData
        },
        dataFields,
        graphData,
        isLoading
    };

}