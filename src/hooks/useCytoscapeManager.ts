import { useCallback, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { GraphNode } from "@/types/GraphNode";

export type CytoscapeManager = ReturnType<typeof useCytoscapeManager>;

export const CyLayouts = {
  COSE_LAYOUT: { name: 'cose-bilkent' },
} as const;

type CyLayoutKeys = keyof typeof CyLayouts;
type CyLayoutValue = (typeof CyLayouts)[CyLayoutKeys];

export function useCytoscapeManager() {
  const [layout, setLayout] = useState<CyLayoutValue>(CyLayouts.COSE_LAYOUT);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);

  return {
    cy,
    setCy: useCallback((next: cytoscape.Core) => {
      if (cy !== next) {
        console.warn('Resetting Cy', { cy, next });
        setCy(next);
      }
    }, [cy]),

    layout: layout,
    setLayout: useCallback((layout: CyLayoutValue) => {
      cy?.layout(layout).run();
      setLayout(layout);
    }, [cy]),


    setSelectedElement: useCallback((selectedElement: GraphNode) => {
      cy?.elements().deselect();

      if (selectedElement) {
        cy?.elements(`node[id="${selectedElement.id}"]`).select();
      }
    }, [cy]),

  } as const;
}
