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


export function useGraphDataManager(setIsLoading: SetStateAction<any>) {

    const [graphData, setGraphData] = useState(
        {nodes: new Array<GraphNode>, edges: new Array<GraphEdge>}
    );

    //TODO: if I use "useCallback" here why do I need to declare it below in the dependency array of the useMemo
    const parseRawEdge = useCallback((rawEdge: Record<string, any>) => {
        const data = rawEdge as Omit<any, 'id' | 'source' | 'target' | 'type' | 'currencyPaid' | 'amountPaid'>  //TODO: this needs to be automated
        if (rawEdge['type'] == EdgeType.transaction)
            return new TransactionEdge(
                rawEdge['source'],
                rawEdge['target'],
                rawEdge['id'],
                parseFloat(rawEdge['amountPaid']),
                rawEdge['currencyPaid'],
                data,
                parseFloat(rawEdge['timestamp']),
            )

        if (rawEdge['type'] == EdgeType.connection)
            return new ConnectionEdge(
                rawEdge['source'],
                rawEdge['target'],
                rawEdge['id'],
                data
            )

        throw new Error(`Unknown edge type ${rawEdge['type']}`)
    }, [])

    const parseRawNode = useCallback((rawNode: Record<string, any>):GraphNode => {
        if (rawNode['type'] == NodeType.person)
            return new PersonNode(rawNode['id'], rawNode['name'], rawNode as Omit<any, 'id' | 'name' | 'type'>);

        if (rawNode['type'] == NodeType.account)
            return new AccountNode(rawNode['id'], rawNode as Omit<any, 'id' | 'name' | 'type'>);

        throw new Error(`Unknown node type ${rawNode['type']}`)
    }, [])

    const expandNodeData = useMemo(() => {
        return async (node_id: string) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/neighbors/${node_id}`)
            const [rawNeighborNodes, rawNeighborEdges] = await response.json();
            const neighborNodes = rawNeighborNodes.map(parseRawNode)
            const neighborEdges = rawNeighborEdges.map(parseRawEdge)
            setGraphData({
                nodes: neighborNodes.concat(graphData.nodes.filter((a:GraphNode) => !neighborNodes.find((b:GraphNode) => b.id === a.id))),
                edges: neighborEdges.concat(graphData.edges.filter((a:GraphEdge) => !neighborEdges.find((b:GraphEdge) => b.id === a.id)))
            })
            setIsLoading(false);
        };
    }, [setGraphData, graphData, setIsLoading, parseRawNode, parseRawEdge]);

    const removeNodeData = (node_ids: Array<string>) => {
        const newNodes = graphData.nodes.filter((node:GraphNode) => !node_ids.includes(node.id))
        const newEdges = graphData.edges.filter((edge:GraphEdge) => !node_ids.includes(edge.source) && !node_ids.includes(edge.target))
        setGraphData({
            nodes: newNodes,
            edges: newEdges
        })
    };

    const loadGraphData = useMemo(() => {
        return async (node_ids: string[]) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/graph/${node_ids.join(',')}`)
            const [rawNodes, rawEdges] = await response.json();
            setGraphData({
                nodes: rawNodes.map(parseRawNode),
                edges: rawEdges.map(parseRawEdge)
            })
            setIsLoading(false);
        };
    }, [setGraphData, setIsLoading, parseRawNode, parseRawEdge]);

    return {
        expandNodeData,
        removeNodeData,
        loadGraphData,
        graphData
    };

}