import {SetStateAction, useMemo, useState} from "react";
import {SERVER_URL} from "@/app/definitions";
import * as React from "react";
import {GridApi} from '@mui/x-data-grid';

export function useLoadDataPopupSearch(setTableData: SetStateAction<any>) {

    const [isLoading, setIsLoading] = useState(false);

    const doLoadDataPopupSearch = useMemo(() => {
        return async (personName: string) => {
            setIsLoading(true);
            const response = await fetch(`${SERVER_URL}/person/${personName}`)
            const nodesData = await response.json();
            setTableData(nodesData)
            setIsLoading(false);
        };
    }, [setTableData]);

    return {
        isLoading,
        doLoadDataPopupSearch,
    };

}
