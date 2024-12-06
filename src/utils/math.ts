import {sortAscend} from "@/utils/array";

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const mean = (arr: number[]) => sum(arr) / arr.length;

export const std = (arr: number[]) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

export const quantile = (arr: number[], q:number) => {
    const sorted = sortAscend(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};