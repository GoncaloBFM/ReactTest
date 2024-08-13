import {MutableRefObject, SetStateAction} from "react";
import cytoscape from "cytoscape";

export type CytoscapeManagerType = {
    ref: MutableRefObject<cytoscape.Core | undefined>,
    layout: any
    setLayout: SetStateAction<any>
}