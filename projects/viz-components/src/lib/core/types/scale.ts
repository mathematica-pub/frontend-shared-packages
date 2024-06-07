import { VicContinuousValue } from './value-type';

export interface GenericScale<Domain, Range> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any): Range;
  domain?(): Domain[];
  range?(): Range[];
}

export type VicQuantitativeScale = GenericScale<VicContinuousValue, number>;
