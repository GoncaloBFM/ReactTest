export const bifurcateBy = <T>(arr: Array<T>, fn: (e: T)=>boolean): [Array<T>, Array<T>] =>
  arr.reduce(
    (acc, val, _) => {
      acc[fn(val) ? 0 : 1].push(val);
      return acc;
    },
    [new Array<T>(), new Array<T>()]
  );

export const arrayMax = (arr: number[]) => arr.reduce((state, e) => Math.max(e, state), -Infinity)
export const arrayMin = (arr: number[]) => arr.reduce((state, e) => Math.min(e, state), Infinity)


export const sortAscend = (arr: number[]) => arr.sort((a, b) => a - b);
export const sortDescend = (arr: number[]) => arr.sort((a, b) => b - a);

export const arrayRange = (start:number, stop:number, step:number) =>
    Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step);
