import { VicContinuousValue } from './value-type';

export interface GenericScale<Domain, Range> {
  (...args: any): Range;
  domain?(): Domain[];
  range?(): Range[];
}

export type VicQuantitativeScale = GenericScale<VicContinuousValue, number>;
