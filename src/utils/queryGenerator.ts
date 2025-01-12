import { SERVER_URL } from "@/app/definitions";
import {ElementType} from "@/types/ElementType";
import {parseRawEdge, parseRawNode} from "@/utils/responseParser";
import {GraphElement} from "@/types/GraphElement";
import {EdgeType} from "@/types/EdgeType";

export type SearchResponse = {
    data: GraphElement[];
    count: number
};

export const SearchType = {
    all: 'all',
    neighbor: 'neighbors'
} as const

export const searchDatabase = async (
    elementType: (typeof ElementType)[keyof typeof ElementType],
    originNodes: string[],
    nodesToFilterBy: string[],
    usePagination: boolean,
    pageIndex: number,
    pageSize:number,
    typeFilter: string,
    columnFilters: Record<string, string>[],
    sorting: Record<string, string>[]
    ) => {

    const endpoint = `/${elementType}s`

    const fetchURL = new URL(endpoint, SERVER_URL);

    fetchURL.searchParams.set('origin-nodes', JSON.stringify(originNodes));
    fetchURL.searchParams.set('filter-by-nodes', JSON.stringify(nodesToFilterBy));

    if (usePagination) {
        fetchURL.searchParams.set(
            'start',
            `${pageIndex * pageSize}`,
        );
        fetchURL.searchParams.set('size', `${pageSize}`);
    }

    const addedTypeFilter =
        typeFilter != ''
            ? [{'id': 'type', 'value': typeFilter}]
            : []

    fetchURL.searchParams.set('filters', JSON.stringify((columnFilters.concat(
        addedTypeFilter
    ))));
    fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

    const response = await fetch(fetchURL.href);
    const [body, status] = (await response.json())
    if(status != 200)
        throw Error()

    const data =  elementType == ElementType.node ? body['data'].map(parseRawNode) : body['data'].map(parseRawEdge)
    const count = body['count']
    return {data: data, count: count} as SearchResponse
}