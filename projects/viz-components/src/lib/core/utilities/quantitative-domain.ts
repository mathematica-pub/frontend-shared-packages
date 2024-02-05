import { Numeric, max, min } from 'd3';
import {
  DomainPadding,
  VicDomainPaddingConfig,
} from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';
import { VicQuantitativeScale } from '../types/scale';
import { ToArray } from '../types/utility';
import { isNumbers } from './type-guard';

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
    scaleType?: any,
    chartRange?: [number, number]
  ): [number, number] {
    const domainMin = this.getPaddedDomainValue(
      unpaddedDomain,
      domainPadding,
      'min',
      scaleType,
      chartRange
    );
    const domainMax = this.getPaddedDomainValue(
      unpaddedDomain,
      domainPadding,
      'max',
      scaleType,
      chartRange
    );
    // we don't necessarily want this -- if we are working with a domain of [0, 0.001] we don't want to all of a sudden take the max to 1;
    if (domainMin === domainMax) {
      return [domainMin, domainMin + 1];
    } else {
      return [domainMin, domainMax];
    }
  }

  static getPaddedDomainValue(
    unpaddedDomain: [number, number],
    padding: VicDomainPaddingConfig,
    valueType: DomainExtent,
    scaleType: VicQuantitativeScale,
    chartRange?: [number, number]
  ) {
    let paddedValue =
      valueType === 'min' ? unpaddedDomain[0] : unpaddedDomain[1];
    const value = paddedValue;
    if (padding.type === DomainPadding.roundUp) {
      paddedValue = this.getQuantitativeDomainMaxRoundedUp(
        value,
        padding.sigDigits(value),
        valueType
      );
    } else if (padding.type === DomainPadding.percentOver) {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.sigDigits(value),
        padding.percentOver,
        valueType
      );
    } else if (padding.type === DomainPadding.roundInterval) {
      paddedValue = ValueUtilities.getValueRoundedToInterval(
        value,
        padding.interval(value),
        valueType
      );
    } else if (padding.type === DomainPadding.numPixels) {
      paddedValue = this.getPixelPaddedDomainValue(
        unpaddedDomain,
        padding.numPixels,
        valueType,
        scaleType,
        chartRange
      );
    }
    return paddedValue;
  }

  static getPixelPaddedDomainValue(
    unpaddedDomain: [number, number],
    numPixels: number,
    valueType: DomainExtent,
    scaleType: any,
    chartRange: [number, number]
  ): number {
    if (chartRange[1] < chartRange[0]) numPixels = -1 * numPixels;
    const value = valueType === 'min' ? unpaddedDomain[0] : unpaddedDomain[1];
    if (value === 0) return value;
    const adjustedPixelRange =
      valueType === 'min' && unpaddedDomain[0] < 0
        ? [chartRange[0] + numPixels, chartRange[1]]
        : [chartRange[0], chartRange[1] - numPixels];
    const scale = scaleType(unpaddedDomain, adjustedPixelRange);
    const targetVal = valueType === 'min' ? chartRange[0] : chartRange[1];
    return scale.invert(targetVal);
  }

  static getQuantitativeDomainMaxRoundedUp(
    value: number,
    sigDigits: number,
    valueType: DomainExtent
  ): number {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      value,
      sigDigits,
      valueType
    );
  }

  static getQuantitativeDomainMaxPercentOver(
    value: number,
    sigDigits: number,
    percent: number,
    valueType: DomainExtent
  ): number {
    let overValue = Math.abs(value) * (1 + percent);
    if (value < 0) overValue = -overValue;
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      overValue,
      sigDigits,
      valueType
    );
  }
}
