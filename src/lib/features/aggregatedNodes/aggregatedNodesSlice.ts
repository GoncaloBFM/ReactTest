import { createAppSlice } from "@/lib/createAppSlice";
import { md5 } from 'js-md5';
import { PayloadAction } from "@reduxjs/toolkit";
import { GraphDataIdentifier } from "../graphData/graphDataApiClient";


export interface AggregatedNodesSliceState {
  aggregatedNodesById: Record<GraphDataIdentifier, GraphDataIdentifier[]>,
}

const initialState: AggregatedNodesSliceState = {
  aggregatedNodesById: {},
};

function aggregatedId(aggregatedNodesIds: GraphDataIdentifier[]) {
  return `agg_${md5(aggregatedNodesIds.sort().join(';;'))}`;
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const aggregateNodesSlice = createAppSlice({
  name: "aggregatedNodes",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    aggregateNodes: create.reducer(
      (state, action: PayloadAction<GraphDataIdentifier[]>) => {
        const aggId = aggregatedId(action.payload);
        const curr = state.aggregatedNodesById[aggId];

        if (curr != null) {
          // TODO detect collision and warn
          // for now just ignore
          return;
        }

        state.aggregatedNodesById[aggId] = action.payload;
      }
    ),

    removeAggregation: create.reducer(
      (state, action: PayloadAction<GraphDataIdentifier>) => {
        delete state.aggregatedNodesById[action.payload];
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
  aggregateNodes,
  removeAggregation
} = aggregateNodesSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
} = aggregateNodesSlice.selectors;

