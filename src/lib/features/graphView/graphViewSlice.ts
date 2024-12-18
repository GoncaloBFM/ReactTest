import { createAppSlice } from "@/lib/createAppSlice";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";
import { GraphDataSliceState } from "../graphData/graphDataSlice";
import { AggregatedNodesSliceState } from "../aggregatedNodes/aggregatedNodesSlice";
import { GraphDataIdentifier } from "../graphData/graphDataApiClient";

export interface GraphViewSliceState {
  selectedNodes: GraphDataIdentifier[],
  hiddenNodes: GraphDataIdentifier[],
}

const initialState: GraphViewSliceState = {
  selectedNodes: [],
  hiddenNodes: [],
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const graphViewSlice = createAppSlice({
  name: "graphView",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setSelectedNodes: create.reducer(
      (state, action: PayloadAction<GraphDataIdentifier[]>) => {
        state.selectedNodes = action.payload;
      }
    ),

    // TODO should we unhide?
    hideNode: create.reducer(
      (state, action: PayloadAction<GraphDataIdentifier>) => {
        state.hiddenNodes.push(action.payload);
      }
    ),

  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
  },
});

// Action creators are generated for each case reducer function.
export const {
  setSelectedNodes,
  hideNode,
} = graphViewSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
} = graphViewSlice.selectors;

type PartialGlobalState = {
  graphData: GraphDataSliceState,
  aggregatedNodes: AggregatedNodesSliceState,
  graphView: GraphViewSliceState,
};

// global selector
export const selectGraphView = createSelector(
  [
    (state: PartialGlobalState) => state.graphData.nodesById,
    (state: PartialGlobalState) => state.graphData.edgesById,
    (state: PartialGlobalState) => state.aggregatedNodes.aggregatedNodesById,
    (state: PartialGlobalState) => state.graphView.hiddenNodes,
  ],
  (nodesData, edgesData, aggregated, hidden) => {
    const aggregatedNodeIds = Object.values(aggregated);
    const flattenAggregatedNodeIds = Array.from(
      new Set(aggregatedNodeIds.flat())
        .values());

    const nodes = Object.values(nodesData)
      .filter(n =>
        !flattenAggregatedNodeIds.includes(n.id) //filter aggregated
        && !hidden.includes(n.id) // filter hidden
      )
      .map(e => ({
        ...e,
        expanded: false, // TODO compute
      }));

    const edges = Object.values(edgesData)
      // include only edges with both to/from existing nodes
      .filter(e => nodes.some(n => n.id === e.node_from)
        && nodes.some(n => n.id === e.node_to))
      .map(({ id, node_to, node_from, ...rest }) => ({
        ...rest,
        id,
        source: node_from,
        target: node_to,
      }));

    return { nodes, edges };
  }
);

export const selectSelectedNodes = createSelector(
  [
    (state: PartialGlobalState) => selectGraphView(state),
    (state: PartialGlobalState) => state.graphView.selectedNodes,
  ],
  (view, selectedNodes) => {
    return view.nodes.filter(n => selectedNodes.includes(n.id));
  }
);


