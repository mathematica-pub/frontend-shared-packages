import { Numeric, ScaleContinuousNumeric, max, min } from 'd3';
import {
  DomainPadding,
  VicDomainPaddingConfig,
} from '../../data-marks/data-dimension.config';
import { ToArray } from '../types/utility';
import { VicValueExtent } from '../types/values';
import { isNumberArray } from './type-guard';
import { ValueUtilities } from './values';

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
    if (isNumberArray(extents)) {
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
    let domainMin: number;
    let domainMax: number;
    if (unpaddedDomain[0] >= 0 && unpaddedDomain[1] >= 0) {
      domainMin = unpaddedDomain[0];
      domainMax = this.getPaddedDomainValue(
        unpaddedDomain[1],
        domainPadding,
        VicValueExtent.max,
        scaleType,
        unpaddedDomain,
        chartRange
      );
    } else if (unpaddedDomain[0] <= 0 && unpaddedDomain[1] <= 0) {
      domainMin = this.getPaddedDomainValue(
        unpaddedDomain[0],
        domainPadding,
        VicValueExtent.min,
        scaleType,
        unpaddedDomain,
        chartRange
      );
      domainMax = unpaddedDomain[1];
    } else if (unpaddedDomain[0] < 0 && unpaddedDomain[1] > 0) {
      if (domainPadding.type === DomainPadding.numPixels) {
        [domainMin, domainMax] =
          this.getPixelPaddedDomainValuePositiveAndNegative(
            unpaddedDomain,
            domainPadding.numPixels,
            scaleType,
            chartRange
          );
      } else {
        domainMin = this.getPaddedDomainValue(
          unpaddedDomain[0],
          domainPadding,
          VicValueExtent.min,
          scaleType,
          unpaddedDomain,
          chartRange
        );
        domainMax = this.getPaddedDomainValue(
          unpaddedDomain[1],
          domainPadding,
          VicValueExtent.max,
          scaleType,
          unpaddedDomain,
          chartRange
        );
      }
    }
    return [domainMin, domainMax];
  }

  static getPaddedDomainValue(
    value: number,
    padding: VicDomainPaddingConfig,
    valueType: VicValueExtent,
    scaleType: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>,
    unpaddedDomain: [number, number],
    chartRange?: [number, number]
  ): number {
    let paddedValue = value;
    if (padding.type === DomainPadding.roundUp) {
      paddedValue = ValueUtilities.getValueRoundedToNSignificantDigits(
        value,
        padding.sigDigits(value),
        valueType
      );
    } else if (padding.type === DomainPadding.roundInterval) {
      paddedValue = ValueUtilities.getValueRoundedToInterval(
        value,
        padding.interval(value),
        valueType
      );
    } else if (padding.type === DomainPadding.percentOver) {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.percentOver
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

  static getQuantitativeDomainMaxPercentOver(
    value: number,
    percent: number
  ): number {
    let overValue = Math.abs(value) * (1 + percent);
    if (value < 0) overValue = -overValue;
    return overValue;
  }

  static getPixelPaddedDomainValue(
    unpaddedDomain: [number, number],
    numPixels: number,
    valueType: DomainExtent,
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>,
    chartRange: [number, number]
  ): number {
    if (chartRange[1] < chartRange[0]) numPixels = -1 * numPixels; // When would we ever have this?
    const value =
      valueType === VicValueExtent.min ? unpaddedDomain[0] : unpaddedDomain[1];
    if (value === 0) return value;
    const adjustedPixelRange =
      valueType === VicValueExtent.min && unpaddedDomain[0] < 0
        ? [chartRange[0] + numPixels, chartRange[1]]
        : [chartRange[0], chartRange[1] - numPixels];
    const scale = scaleFn(unpaddedDomain, adjustedPixelRange);
    const targetVal =
      valueType === VicValueExtent.min ? chartRange[0] : chartRange[1];
    return scale.invert(targetVal);
  }

  // We need to set both sides padding at the same time in this case to get N pixels on both sides
  static getPixelPaddedDomainValuePositiveAndNegative(
    unpaddedDomain: [number, number],
    numPixels: number,
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>,
    chartRange: [number, number]
  ): [number, number] {
    const adjustedPixelRange = [
      chartRange[0] + numPixels,
      chartRange[1] - numPixels,
    ];
    const scale = scaleFn(unpaddedDomain, adjustedPixelRange);
    return [scale.invert(chartRange[0]), scale.invert(chartRange[1])];
  }
}
