import { Numeric, max, min } from 'd3';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPaddingConfig,
} from '../../data-marks/dimensions/data-domain-padding';
import { ToArray } from '../types/utility';
import { isNumbers } from './type-guards';

export type DomainExtent = 'max' | 'min';

export class QuantitativeDomainUtilities {
  static getUnpaddedDomain(
    userDomain: [number, number] | undefined,
    values: number[],
    domainIncludesZero: boolean
  ): [number, number];
  static getUnpaddedDomain(
    userDomain: [Date, Date] | undefined,
    values: Date[]
  ): [Date, Date];
  static getUnpaddedDomain(
    userDomain: [number, number] | [Date, Date] | undefined,
    values: ToArray<number | Date>,
    domainIncludesZero?: boolean
  ): [number, number] | [Date, Date];
  static getUnpaddedDomain(
    userDomain: [number, number] | [Date, Date] | undefined,
    values: ToArray<number | Date>,
    domainIncludesZero?: boolean
  ): [number, number] | [Date, Date] {
    const valueFns = [min, max];
    const extents =
      userDomain === undefined
        ? (valueFns.map((valueFn) => valueFn<Numeric>(values)) as
            | [number, number]
            | [Date, Date])
        : userDomain;
    if (isNumbers(extents)) {
      return this.getAdjustedDomain(extents, domainIncludesZero);
    } else {
      return extents;
    }
  }

  static getAdjustedDomain(
    domain: [number, number],
    domainIncludesZero: boolean
  ): [number, number] {
    return domainIncludesZero
      ? [min([domain[0], 0]), max([domain[1], 0])]
      : [domain[0], domain[1]];
  }

  static getPaddedDomain(
    unpaddedDomain: [number, number],
    domainPadding: VicDomainPaddingConfig,
    scaleFn?: any,
    chartRange?: [number, number]
  ): [number, number] {
    const domainMinArgs: PaddedDomainArguments = {
      value: unpaddedDomain[0],
      valueType: 'min',
      scaleFn,
      unpaddedDomain,
      chartRange,
    };
    const domainMaxArgs: PaddedDomainArguments = {
      value: unpaddedDomain[1],
      valueType: 'max',
      scaleFn,
      unpaddedDomain,
      chartRange,
    };
    let domainMin: number;
    let domainMax: number;
    if (unpaddedDomain[0] >= 0 && unpaddedDomain[1] >= 0) {
      domainMin = unpaddedDomain[0];
      domainMax = domainPadding.getPaddedDomainValue(domainMaxArgs);
    } else if (unpaddedDomain[0] <= 0 && unpaddedDomain[1] <= 0) {
      domainMin = domainPadding.getPaddedDomainValue(domainMinArgs);
      domainMax = unpaddedDomain[1];
    } else if (unpaddedDomain[0] < 0 && unpaddedDomain[1] > 0) {
      if (domainPadding.type === DomainPadding.numPixels) {
        [domainMin, domainMax] =
          domainPadding.getPositiveAndNegativePaddedDomainValues(
            unpaddedDomain,
            scaleFn,
            chartRange
          );
      } else {
        domainMin = domainPadding.getPaddedDomainValue(domainMinArgs);
        domainMax = domainPadding.getPaddedDomainValue(domainMaxArgs);
      }
    }
    return [domainMin, domainMax];
  }
}
