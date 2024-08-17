import { useContext } from "react";
import { GraphVisualizationContext } from "./GraphVisualizationProvider";

export function useGraphVisualization() {
  const ctx = useContext(GraphVisualizationContext);

  return {
    cy: ctx.cy,
  } as const;
}
