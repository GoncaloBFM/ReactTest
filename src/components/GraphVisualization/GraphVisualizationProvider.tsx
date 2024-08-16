import { createContext, useCallback, useState } from "react";
import cytoscape from "cytoscape";

type Context = {
  cy: cytoscape.Core | null;
  setCy: (cy: cytoscape.Core) => void
}

export const GraphVisualizationContext = createContext<Context>({
  cy: null,
  setCy: () => { },
});

export function GraphVisualizationProvider(props: React.PropsWithChildren) {
  const [cy, setCy] = useState<cytoscape.Core | null>(null);

  const value = {
    cy,
    setCy: useCallback((next: cytoscape.Core) => {
      if (cy !== next) {
        console.warn('Resetting Cy', { cy, next });
        setCy(next);
      }
    }, [cy]),
  } as const;

  return (
    <GraphVisualizationContext.Provider value={value}>
      {props.children}
    </GraphVisualizationContext.Provider>
  );
}

export function useGraphVisualizationControl() {
  const [cy, setCy] = useState<cytoscape.Core | null>(null);

  return {
    cy,
    setCy: useCallback((next: cytoscape.Core) => {
      if (cy !== next) {
        console.warn('Resetting Cy', { cy, next });
        setCy(next);
      }
    }, [cy]),
  } as const;
}
