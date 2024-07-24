import { useMemo, useState } from "react";

const dataset = [
    "1",
    "2",
    "3",
    "4",
];

function delayMs(ms: number) {
    return new Promise((res, err) => {
        setTimeout(() => res(null), ms);
    })
}

type FilteringCriteria = { list: string[] };

export type PlottingData = typeof dataset;

export function usePlottingData() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(dataset);

    const filterData = useMemo(() => {
        return async (criteria: FilteringCriteria) => {
            setIsLoading(true);

            // TODO fetch data from server API
            await delayMs(3_000);

            // TODO update data according with received API response
            setData(dataset.filter(e => criteria.list.includes(e)));
            setIsLoading(false);
        };
    }, []);

    return {
        filterData,
        isLoading,
        data: isLoading ? [] : data,
    };

}
