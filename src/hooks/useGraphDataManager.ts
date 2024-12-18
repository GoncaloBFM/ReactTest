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
import {CompanyNode} from "@/types/CompanyNode";
import {parseRawEdge, parseRawNode} from "@/utils/apiResponseParser";

export type GraphManager = {
    expandNodeData: (nodeIds: Array<string>, callback?: (wasRemoved: boolean) => void) => void,
    loadPathData: (nodeId1:string, nodeId2:string, nNodesInPath:number, callback?: (wasRemoved: boolean) => void) => void,
    removeNodeData: (nodeIds: Array<string>) => void,
    loadGraphData: (nodeIds: Array<string>) => void,
    removeEdgeData: (nodeIds: Array<string>) => void
    addToGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void
}

export function useGraphDataManager(afterGraphDataAdded: ()=>void, afterGraphDataRemoved: () => void) {
    const [isLoading, setIsLoading] = useState(false); //TODO: ensure is loading stops all ui activity, also ui shouldn't be managed here

    const [graphData, setGraphData] = useState(new GraphData([], []));

    const expandNodeData = useMemo(() => {
        return async (nodeIds: Array<string>, callback?: (wasAdded: boolean)=>void) => {
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
            const wasAdded = newNodes.length > 1 || newEdges.length > 1
            if (wasAdded)
                afterGraphDataAdded()
            if (callback != undefined)
                callback(wasAdded)

        };
    }, [setGraphData, graphData, setIsLoading, afterGraphDataAdded]);


    const loadPathData = useMemo(() => {
        return async (nodeId1: string, nodeId2: string, nNodesInPath: number, callback?: (wasAdded: boolean)=>void) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/path/${nodeId1},${nodeId2},${nNodesInPath}`)
            const [rawNeighborNodes, rawNeighborEdges] = await response.json();
            const newNeighborNodes = rawNeighborNodes.map(parseRawNode)
            const newNeighborEdges = rawNeighborEdges.map(parseRawEdge)
            const newNodes = graphData.nodesList.concat(newNeighborNodes.filter((n:GraphNode) => !graphData.nodesMap.has(n.id)))
            const newEdges = graphData.edgesList.concat(newNeighborEdges.filter((e:GraphEdge) => !graphData.edgesMap.has(e.id)))
            setGraphData(new GraphData(newNodes, newEdges))
            setIsLoading(false);
            const wasAdded = newNodes.length > 1 || newEdges.length > 1
            if (wasAdded)
                afterGraphDataAdded()
            if (callback != undefined)
                callback(wasAdded)

        };
    }, [setGraphData, graphData, setIsLoading, afterGraphDataAdded]);

    const removeNodeData = (nodeIds: Array<string>) => {
        const [newEdges, removedEdges] = bifurcateBy(graphData.edgesList, (edge) => !nodeIds.some(nodeId => nodeId == edge.source || nodeId == edge.target))
        removedEdges.forEach(e => {
            graphData.nodesMap.get(e.source).expanded = false
            graphData.nodesMap.get(e.target).expanded = false
        })
        nodeIds.forEach(nodeId => graphData.nodesMap.delete(nodeId))
        setGraphData(new GraphData(graphData.nodesMap, newEdges))
        afterGraphDataRemoved() //TODO: only call this when stuff was removed
    };

    const removeEdgeData = (edgeIds: Array<string>) => {
        edgeIds.forEach(edgeId => {
            const edge = graphData.edgesMap.get(edgeId)
            graphData.nodesMap.get(edge.source).expanded = false
            graphData.nodesMap.get(edge.target).expanded = false
        })
        edgeIds.forEach(edgeId => graphData.edgesMap.delete(edgeId))
        setGraphData(new GraphData(graphData.nodesMap, graphData.edgesMap))
        afterGraphDataRemoved()
    };

    const addToGraph = useCallback((nodes: GraphNode[], edges: GraphEdge[]) => {
        const newNodes = graphData.nodesList.concat(nodes.filter((n:GraphNode) => !graphData.nodesMap.has(n.id)))
        const newEdges = graphData.edgesList.concat(edges.filter((e:GraphEdge) => !graphData.edgesMap.has(e.id)))
        setGraphData(new GraphData(newNodes, newEdges))
        afterGraphDataAdded()
    }, [graphData, afterGraphDataAdded])


    const loadGraphData = useMemo(() => {
        return async (nodeIds: string[]) => {
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
    }, [setGraphData, setIsLoading, afterGraphDataAdded, graphData]);

    return {
        graphManager: {
            expandNodeData,
            loadPathData,
            removeNodeData,
            loadGraphData,
            removeEdgeData,
            addToGraph
        },
        graphData,
        isLoading
    };

}