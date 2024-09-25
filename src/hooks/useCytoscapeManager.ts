import {useCallback, useEffect, useRef, useState} from "react";
import cytoscape from "cytoscape";
import { GraphNode } from "@/types/GraphNode";
import {GraphData} from "@/types/GraphData";

export type CytoscapeManager = ReturnType<typeof useCytoscapeManager>;

export const CyLayouts = {
  COSE_LAYOUT: { name: 'cose-bilkent' },
} as const;

type CyLayoutValue = (typeof CyLayouts)[keyof typeof CyLayouts];

export function useCytoscapeManager(graphData: GraphData) {
  const [layout, setLayout] = useState<CyLayoutValue>(CyLayouts.COSE_LAYOUT);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);

  const runLayout = useCallback((layout: CyLayoutValue) => {
      cy?.layout(layout).run();
    }, [cy])

  const reRunLayout = useCallback(() => {
    runLayout(layout)
    }, [runLayout, layout])

  useEffect(() => {
    runLayout(layout)
  }, [runLayout, layout, graphData])

  return {
    cy,
    setCy: useCallback((next: cytoscape.Core) => {
      if (cy !== next) {
        setCy(next);
      }
    }, [cy]),

    setLayout: setLayout,
    reRunLayout: reRunLayout,
    layout: layout,
    setSelectedElement: useCallback((selectedElement: GraphNode) => {
      cy?.elements().deselect();

      if (selectedElement) {
        cy?.elements(`node[id="${selectedElement.id}"]`).select();
      }
    }, [cy]),

  } as const;
}
