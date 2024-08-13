import {SetStateAction, useMemo, useState} from "react";
import {SERVER_URL} from "@/app/definitions";
import {GraphData} from "@/types/GraphData";
import {EdgeDataType} from "@/types/EdgeDataType";
import {NodeDataType} from "@/types/NodeDataType";


export function useGraphDataManager(setIsLoading: SetStateAction<any>) {

    const [graphData, setGraphData] = useState(new GraphData());

    const expandNodeData = useMemo(() => {
        return async (node_id: string) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/neighbors/${node_id}`)
            const [neighborNodes, neighborEdges] = await response.json();
            const newNodes = neighborNodes.concat(graphData.nodes.filter((a:NodeDataType) => !neighborNodes.find((b:NodeDataType) => b.id === a.id)));
            const newEdges = neighborEdges.concat(graphData.edges.filter((a:EdgeDataType) => !neighborEdges.find((b:EdgeDataType) => b.id === a.id)));
            setGraphData({
                nodes: newNodes,
                edges: newEdges
            })
            setIsLoading(false);
        };
    }, [setGraphData, graphData, setIsLoading]);

    const removeNodeData = (node_ids: Array<string>) => {
        const newNodes = graphData.nodes.filter((node:NodeDataType) => !node_ids.includes(node.id))
        const newEdges = graphData.edges.filter((edge:EdgeDataType) => !node_ids.includes(edge.origin) && !node_ids.includes(edge.target))
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
                nodes: rawNodes,
                edges: rawEdges
            })
            setIsLoading(false);
        };
    }, [setGraphData, setIsLoading]);

    return {
        expandNodeData,
        removeNodeData,
        loadGraphData,
        graphData
    };

}
