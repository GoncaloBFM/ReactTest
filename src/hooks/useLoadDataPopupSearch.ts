import { useMemo, useState } from "react";

function delayMs(ms: number) {
    return new Promise((res, err) => {
        setTimeout(() => res(null), ms);
    })
}

const emptyTableData = {rowData:[], columnDefinitions:[]}

export function useLoadDataPopupSearch() {

    const [tableData, setTableData] = useState(emptyTableData);
    const [isLoading, setIsLoading] = useState(false);

    const getLoadDataPopupSearchResult = useMemo(() => {
        return async (account_id: string) => {
            setIsLoading(true);

            fetch('')
                .then(response => console.log(response.json()))
                .then(data => console.log(data));

            setTableData(emptyTableData)
            setIsLoading(false);
        };
    }, []);

    return {
        isLoading,
        tableData: isLoading ? emptyTableData : tableData,
        getLoadDataPopupSearchResult,
    };

}
