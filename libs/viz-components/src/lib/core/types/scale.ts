import { ContinuousValue } from './values';

export interface GenericScale<Domain, Range> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any): Range;
  domain?(): Domain[];
  range?(): Range[];
}

export type VicQuantitativeScale = GenericScale<ContinuousValue, number>;
