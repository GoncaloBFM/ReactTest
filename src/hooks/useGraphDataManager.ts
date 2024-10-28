import {SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {SERVER_URL} from "@/app/definitions";
import {GraphEdge} from "@/types/GraphEdge";
import {GraphNode} from "@/types/GraphNode";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {ConnectionEdge} from "@/types/ConnectionEdge";
import {NodeType} from "@/types/NodeType";
import {PersonNode} from "@/types/PersonNode";
import {AccountNode} from "@/types/AccountNode";
import {GraphData} from "@/types/GraphData";
import {bifurcateBy} from "@/utils/array";

export type GraphManager = {
    expandNodeData: (nodeIds: Array<string>) => void,
    removeNodeData: (nodeIds: Array<string>) => void,
    loadGraphData: (nodeIds: Array<string>) => void,
    removeEdgeData: (nodeIds: Array<string>) => void
}

export function useGraphDataManager(afterGraphDataAdded: ()=>void, afterGraphDataRemoved: ()=>void) {
    const [isLoading, setIsLoading] = useState(false); //TODO: ensure is loading stops all ui activity, also ui shouldn't be managed here

    const [graphData, setGraphData] = useState(new GraphData([], []));

    const [dataFields, setDataFields] = useState(
        {
            [NodeType.person]: ['country','address','birthDate'],
            [NodeType.account]: [],
            [EdgeType.transaction]: [],
            [EdgeType.connection]: []
        }
    )

    const parseRawEdge = useCallback((rawEdge: {[key:string]: string}): GraphEdge => {
        if (rawEdge['type'] == EdgeType.transaction) {
            return new TransactionEdge(
                rawEdge['source'],
                rawEdge['target'],
                rawEdge['id'],
                parseFloat(rawEdge['amountPaid']),
                rawEdge['currencyPaid'],
                Object.fromEntries(dataFields.transaction.map((k:string) => [k, rawEdge[k]])),
                new Date(parseFloat(rawEdge['timestamp']) * 1000),
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
            nodeIds.forEach(n => graphData.nodesMap.get(n).expanded= true)
            const newNodes = graphData.nodesList.concat(newNeighborNodes.filter((n:GraphNode) => !graphData.nodesMap.has(n.id)))
            const newEdges = graphData.edgesList.concat(newNeighborEdges.filter((e:GraphEdge) => !graphData.edgesMap.has(e.id)))
            setGraphData(new GraphData(newNodes, newEdges))
            setIsLoading(false);
            afterGraphDataAdded()
        };
    }, [setGraphData, graphData, setIsLoading, parseRawNode, parseRawEdge]);

    const removeNodeData = (nodeIds: Array<string>) => {
        const [newEdges, removedEdges] = bifurcateBy(graphData.edgesList, (edge) => !nodeIds.some(nodeId => nodeId == edge.source || nodeId == edge.target))
        removedEdges.forEach(e => {
            graphData.nodesMap.get(e.source).expanded = false
            graphData.nodesMap.get(e.target).expanded = false
        })
        nodeIds.forEach(nodeId => graphData.nodesMap.delete(nodeId))
        setGraphData(new GraphData(graphData.nodesMap, newEdges))
        afterGraphDataRemoved()
    };

    const removeEdgeData = (edgeIds: Array<string>) => { //TODO: clear not expanded flag on neighbor nodes
        edgeIds.forEach(edgeId => {
            const edge = graphData.edgesMap.get(edgeId)
            graphData.nodesMap.get(edge.source).expanded = false
            graphData.nodesMap.get(edge.target).expanded = false
        })
        edgeIds.forEach(edgeId => graphData.edgesMap.delete(edgeId))
        setGraphData(new GraphData(graphData.nodesMap, graphData.edgesMap))
        afterGraphDataRemoved()
    };

    const loadGraphData = useMemo(() => {
        return async (nodeIds: string[]) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/graph/${nodeIds.join(',')}`)
            const [rawNodes, rawEdges] = await response.json();
            const allNewNodes = rawNodes.map(parseRawNode)
            const allNewEdges = rawEdges.map(parseRawEdge)
            const newNodes = graphData.nodesList.concat(allNewNodes.filter((n:GraphNode) => !graphData.nodesMap.has(n.id)))
            const newEdges = graphData.edgesList.concat(allNewEdges.filter((e:GraphEdge) => !graphData.edgesMap.has(e.id)))
            setGraphData(new GraphData(newNodes, newEdges))
            setIsLoading(false);
            afterGraphDataAdded()
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