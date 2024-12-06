import {useCallback, useEffect, useRef, useState} from "react";
import cytoscape from "cytoscape";

export type CytoscapeManager = ReturnType<typeof useCytoscapeManager>;

export const CyLayouts = {
    COSE_LAYOUT: {name: 'fcose'},
} as const;

type CyLayoutValue = (typeof CyLayouts)[keyof typeof CyLayouts];

export function useCytoscapeManager() {
    const [layout, setLayout] = useState<CyLayoutValue>(CyLayouts.COSE_LAYOUT);
    const [layoutStateCounter, setLayoutStateCounter] = useState(0)
    const [cy, setCy] = useState<cytoscape.Core | null>(null);
    const [groupByCountry, setGroupByCountry] = useState(false)

    const runLayout = useCallback((layout: CyLayoutValue) => {
        cy?.layout(layout).run();
    }, [cy])

    const addElementHighlight = useCallback((elementId: string) => {
        cy?.getElementById(elementId).addClass('manualEdgeHighlight')
    }, [cy])

    const removeElementHighlight = useCallback((elementId: string) => {
        cy?.getElementById(elementId).removeClass('manualEdgeHighlight')
    }, [cy])

    const rerunLayout = useCallback(() => {
        runLayout(layout)
    }, [runLayout, layout])

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

        setLayout: setLayout,
        rerunLayout: rerunLayout,
        rerunLayoutAfterRender: rerunLayoutAfterRender,
        layout: layout,
        setGroupByCountry,
        groupByCountry,
        addElementHighlight,
        removeElementHighlight
    } as const;
}
