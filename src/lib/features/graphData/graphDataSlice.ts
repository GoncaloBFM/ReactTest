import { createAppSlice } from "@/lib/createAppSlice";
import { fetchNodeAsync, GraphDataEdge, GraphDataIdentifier, GraphDataNode } from "./graphDataApiClient";

export interface GraphDataSliceState {
  nodesById: Record<GraphDataIdentifier, GraphDataNode>,
  edgesById: Record<GraphDataIdentifier, GraphDataEdge>,
  pending: string[],
}

const initialState: GraphDataSliceState = {
  nodesById: {},
  edgesById: {},
  pending: [],
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const graphDataSlice = createAppSlice({
  name: "graphData",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    loadData: create.asyncThunk(
      async () => {
        const all = await Promise.all(new Array(13)
          .fill(null)
          .map((_e, idx) => fetchNodeAsync(`${idx}`))
        );

        return {
          nodes: all.flatMap(r => r.nodes),
          edges: all.flatMap(r => r.edges),
        }
      },
      {
        pending: (state, action) => {
          state.pending.push(action.meta.requestId);
        },
        fulfilled: (state, action) => {
          state.pending = state.pending.filter(e => e !== action.meta.requestId);

          action.payload.nodes.forEach(node => {
            //upsert
            state.nodesById[node.id] = node;
          });

          action.payload.edges.forEach(edge => {
            //upsert
            state.edgesById[edge.id] = edge;
          });

        },
        rejected: (state, action) => {
          state.pending = state.pending.filter(e => e !== action.meta.requestId);
        },
      },
    ),


    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    expandNode: create.asyncThunk(
      async (nodeId: GraphDataIdentifier) => {
        return await fetchNodeAsync(nodeId);
      },
      {
        pending: (state, action) => {
          state.pending.push(action.meta.requestId);
        },
        fulfilled: (state, action) => {
          state.pending = state.pending.filter(e => e !== action.meta.requestId);

          action.payload.nodes.forEach(node => {
            //upsert
            state.nodesById[node.id] = node;
          });

          action.payload.edges.forEach(edge => {
            //upsert
            state.edgesById[edge.id] = edge;
          });

        },
        rejected: (state, action) => {
          state.pending = state.pending.filter(e => e !== action.meta.requestId);
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectGraphDataNodes: (graphData) => Object.values(graphData.nodesById),
    selectGraphDataEdges: (graphData) => Object.values(graphData.edgesById),
    selectGraphDataIsLoading: (graphData) => graphData.pending.length > 0,
  },
});

// Action creators are generated for each case reducer function.
export const {
  loadData,
  expandNode
} = graphDataSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectGraphDataNodes,
  selectGraphDataEdges,
  selectGraphDataIsLoading,
} = graphDataSlice.selectors;

