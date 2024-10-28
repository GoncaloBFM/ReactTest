export const bifurcateBy = <T>(arr: Array<T>, fn: (e: T)=>boolean): [Array<T>, Array<T>] =>
  arr.reduce(
    (acc, val, _) => {
      acc[fn(val) ? 0 : 1].push(val);
      return acc;
    },
    [new Array<T>(), new Array<T>()]
  );

export const sortAscend = (arr: number[]) => arr.sort((a, b) => a - b);
export const sortDescend = (arr: number[]) => arr.sort((a, b) => b - a);
