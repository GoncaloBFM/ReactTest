import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {SERVER_URL} from "@/app/definitions";
import {GraphEdge} from "@/types/GraphEdge";
import {GraphNode} from "@/types/GraphNode";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {ConnectionEdge} from "@/types/ConnectionEdge";
import {NodeType} from "@/types/NodeType";
import {PersonNode} from "@/types/PersonNode";
import {AccountNode} from "@/types/AccountNode";
import {GraphData} from "@/types/GraphData";
import {bifurcateBy} from "@/utils/array";
import {GraphElement} from "@/types/GraphElement";
import {Updater} from "@tanstack/table-core";

export type SelectedDataManager = {
    setSelectedElements: (e: Updater<GraphElement[]>) => void
    selectedElements: GraphElement[]
    setSubSelectedElements: Dispatch<SetStateAction<GraphElement[]>>
    subSelectedElements: GraphElement[]
}

export function useSelectedDataManager(afterDataIsSelected: ()=> void) {
    const [selectedElements, setSelectedElements] = useState<GraphElement[]>([]);
    const [subSelectedElements, setSubSelectedElements] = useState<GraphElement[]>([]);

    //TODO: add back button for selections

    return {
        selectedElements,
        subSelectedElements,
        setSubSelectedElements: (e: Updater<any>) => {
            setSubSelectedElements(e)
            afterDataIsSelected()
        },
        setSelectedElements: (e: Updater<any>) => {
            setSubSelectedElements([])
            setSelectedElements(e)
            afterDataIsSelected()
        },
    } as SelectedDataManager
}