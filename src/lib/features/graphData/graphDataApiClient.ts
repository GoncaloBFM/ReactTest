// A mock function to mimic making an async request for data
// export const fetchNode = async (nodeId: string) => {
//   const response = await fetch(`http://localhost:3000/api/nodes/${nodeId}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });
//
//   const result: { data: number } = await response.json();
//   return result;
// };

export type GraphDataIdentifier = string;

export type GraphDataNode = {
  id: GraphDataIdentifier;
  data: Record<string, unknown>;
}

export type GraphDataEdge = {
  id: GraphDataIdentifier;
  node_from: GraphDataIdentifier;
  node_to: GraphDataIdentifier;
  data: Record<string, unknown>;
}

function delayAsync(min = 100, max = 2_000) {
  return new Promise<void>((res) => {
    const delay = min + Math.random() * (max - min);
    setTimeout(() => res(), delay);
  })
}

function randomNode(id: GraphDataIdentifier | null = null): GraphDataNode {
  id = id == null
    ? `node_${Math.floor(Math.random() * 10_000_000)}`
    : id;

  return {
    id,
    data: {
      prop0: `fake node id=${id}`,
      prop1: Math.random(),
      prop2: `string_${Math.random()}`,
    },
  };
}

function randomEdge(nodes: GraphDataNode[], id: GraphDataIdentifier | null = null): GraphDataEdge {
  const from = nodes[Math.floor(Math.random() * nodes.length)];
  const to = nodes[Math.floor(Math.random() * nodes.length)];

  id = id == null
    ? `edge_${Math.floor(Math.random() * 10_000_000)}`
    : id;

  return {
    id,
    node_from: from.id,
    node_to: to.id,
    data: {
      prop0: `fake edge id=${id}`,
      prop1: Math.random(),
      prop2: `string_${Math.random()}`,
    }
  };
}

export async function fetchNodeAsync(nodeId: string) {
  await delayAsync();

  const nodes = [
    randomNode(nodeId),

    // generate random neighbours
    ...Array(Math.ceil(Math.random() * 5))
      .fill(null)
      .map(() => randomNode())
  ];

  const edges = Array(Math.floor(Math.random() * nodes.length * 2))
    .fill(null)
    .map(() => randomEdge(nodes));

  return {
    nodes,
    edges,
  };
};
