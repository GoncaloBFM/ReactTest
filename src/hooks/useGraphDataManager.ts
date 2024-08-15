import { SetStateAction, useMemo, useState } from "react";
import { SERVER_URL } from "@/app/definitions";
import { Graph } from "@/types/Graph";
import { GraphEdge } from "@/types/GraphEdge";
import { SingleNode } from "@/types/SingleNode";
import { GraphNode } from "@/types/GraphNode";

export type GraphData = {
  nodes: GraphNode[],
  edges: GraphEdge[],
}

const genDefaultData = () => {
  const size = 100;
  const nodes = new Array(size)
    .fill(null)
    .map((_e, idx) => ({
      id: `node_${idx}`,
      expanded: false,
      data: {
        random: Math.random(),
      },
    }));

  function getRandomNode() {
    return nodes[Math.floor(Math.random() * nodes.length)];
  }

  const edges = new Array(size)
    .fill(null)
    .map((_e, idx) => ({
      id: `edge_${idx}`,
      source: getRandomNode().id,
      target: getRandomNode().id,
      data: {
        random: Math.random(),
      },
    }));

  return { nodes, edges }
};


export function useGraphDataManager(setIsLoading: SetStateAction<any>) {

  const [graphData, setGraphData] = useState(() => genDefaultData());
  console.log("useGraphDataManager()", { graphData });

  const expandNodeData = useMemo(() => {
    return async (node_id: string) => {
    };
  }, []);

  const removeNodeData = (node_ids: Array<string>) => {
  };

  const loadGraphData = useMemo(() => {
    return async (node_ids: string[]) => {
    };
  }, []);

  return {
    expandNodeData,
    removeNodeData,
    loadGraphData,
    graphData
  };

}
