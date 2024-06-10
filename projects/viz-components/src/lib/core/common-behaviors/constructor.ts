// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export type AbstractConstructor<T = object> = abstract new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => T;
