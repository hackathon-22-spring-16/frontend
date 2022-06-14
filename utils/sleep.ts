export const sleep = (msec: number): Promise<unknown> =>
  new Promise(resolve => setTimeout(resolve, msec))
