import {useCallback, useEffect, useRef, useState} from "react";
import cytoscape from "cytoscape";
import {PopperInstance} from "cytoscape-popper";

export type CytoscapeManager = ReturnType<typeof useCytoscapeManager>;

export function useCytoscapeManager() {
    const [layoutStateCounter, setLayoutStateCounter] = useState(0)
    const [cy, setCy] = useState<cytoscape.Core | null>(null);
    const [groupByCountry, setGroupByCountry] = useState(false)
    const [poppers, setPoppers] = useState<Array<PopperInstance>>([])

    const runLayout = useCallback(() => {
        cy?.layout({
            name:'fcose',
            quality: "default",
            nodeDimensionsIncludeLabels: false,
            nodeRepulsion: (node: any) => 6000,
            idealEdgeLength: (edge: any) => 90
        } as any).run();
    }, [cy])

    const addElementHighlight = useCallback((elementId: string) => {
        cy?.getElementById(elementId).addClass('manualEdgeHighlight')
    }, [cy])

    const removeElementHighlight = useCallback((elementId: string) => {
        cy?.getElementById(elementId).removeClass('manualEdgeHighlight')
    }, [cy])

    const rerunLayout = useCallback(() => {
        runLayout()
    }, [runLayout])

    const rerunLayoutAfterRender = useCallback(() => {
        setLayoutStateCounter((prev) => prev + 1)
    }, [setLayoutStateCounter])

    useEffect(() => {
         rerunLayout()
    }, [layoutStateCounter, rerunLayout])

    return {
        cy,
        setCy: useCallback((next: cytoscape.Core) => {
            if (cy !== next) {
                setCy(next);
            }
        }, [cy]),
        setGroupByCountry: useCallback((set: boolean) => {
            cy?.startBatch()
            if (!set) {
                cy?.nodes().forEach((n: any) => {
                    if (n.parent) {
                        n.move({parent: null})
                    }
                })
                cy?.elements('node[type="compound"]').remove()
            }
            cy?.endBatch()
            setGroupByCountry(set)
        }, [cy]),
        rerunLayout: rerunLayout,
        rerunLayoutAfterRender: rerunLayoutAfterRender,
        groupByCountry,
        poppers,
        addElementHighlight,
        removeElementHighlight
    } as const;
}
