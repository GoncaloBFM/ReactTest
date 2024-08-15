import {SetStateAction, useRef, useState} from "react";
import cytoscape from "cytoscape";
import {set} from "immutable";

export function useCytoscapeManager(initialLayout: any) {
    const COSE_LAYOUT = {name: 'cose-bilkent'}
    const [layout, setLayout] = useState(initialLayout)
    const ref = useRef<cytoscape.Core | undefined>();
    return {ref, layout:layout, setLayout: setLayout, COSE_LAYOUT}
}
