import {SetStateAction, useMemo, useState} from "react";
import {SERVER_URL} from "@/app/definitions";
import {Graph} from "@/types/Graph";
import {GraphEdge} from "@/types/GraphEdge";
import {SingleNode} from "@/types/SingleNode";


export function useGraphDataManager(setIsLoading: SetStateAction<any>) {

    const [graphData, setGraphData] = useState(new Graph());

    const expandNodeData = useMemo(() => {
        return async (node_id: string) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/neighbors/${node_id}`)
            const [neighborNodes, neighborEdges] = await response.json();
            const newNodes = neighborNodes.concat(graphData.nodes.filter((a:SingleNode) => !neighborNodes.find((b:SingleNode) => b.id === a.id)));
            const newEdges = neighborEdges.concat(graphData.edges.filter((a:GraphEdge) => !neighborEdges.find((b:GraphEdge) => b.id === a.id)));
            setGraphData({
                nodes: newNodes,
                edges: newEdges
            })
            setIsLoading(false);
        };
    }, [setGraphData, graphData, setIsLoading]);

    const removeNodeData = (node_ids: Array<string>) => {
        const newNodes = graphData.nodes.filter((node:SingleNode) => !node_ids.includes(node.id))
        const newEdges = graphData.edges.filter((edge:GraphEdge) => !node_ids.includes(edge.origin) && !node_ids.includes(edge.target))
        setGraphData({
            nodes: newNodes,
            edges: newEdges
        })
    };

    const loadGraphData = useMemo(() => {
        return async (node_ids: string[]) => {
            setIsLoading(true);
            //const response = await fetch(`${SERVER_URL}/graph/${node_ids.join(',')}`)
            //const [rawNodes, rawEdges] = await response.json();
            const [rawNodes, rawEdges] = [[{"country": "Israel", "address": "90576 Sharon Cove", "name": "Melissa Snyder", "id": "p1", "type": "person", "birthDate": "1941-05-27"}, {"country": "Reunion", "address": "2302 Tina Streets Suite 530", "name": "James Knight", "id": "p2", "type": "person", "birthDate": "1927-09-25"}], []]
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
