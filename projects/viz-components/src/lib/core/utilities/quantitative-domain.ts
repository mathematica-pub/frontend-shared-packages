import { Numeric, max, min } from 'd3';
import {
  DomainPadding,
  VicDomainPaddingConfig,
} from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';
import { VicQuantitativeScale } from '../types/scale';
import { ToArray } from '../types/utility';
import { VicContinuousValue } from '../types/value-type';
import { isNumber } from './type-guard';

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
    userDomain: [VicContinuousValue, VicContinuousValue] | undefined,
    values: ToArray<VicContinuousValue>,
    domainIncludesZero?: boolean
  ): [VicContinuousValue, VicContinuousValue];
  static getUnpaddedDomain(
    userDomain: [VicContinuousValue, VicContinuousValue] | undefined,
    values: ToArray<VicContinuousValue>,
    domainIncludesZero?: boolean
  ): [VicContinuousValue, VicContinuousValue] {
    if (userDomain === undefined) {
      return [
        this.getDataExtent('min', values, domainIncludesZero),
        this.getDataExtent('max', values, domainIncludesZero),
      ];
    } else {
      const [userMin, userMax] = userDomain;
      if (isNumber(userMin) && isNumber(userMax) && domainIncludesZero) {
        const userMinAug = userMin + 0;
        return [min([userMinAug, 0]), max([userMax, 0])];
      } else {
        return [userDomain[0], userDomain[1]];
      }
    }
  }

  static getDataExtent(
    extent: DomainExtent,
    values: number[],
    domainIncludesZero: boolean
  ): number;
  static getDataExtent(extent: DomainExtent, values: Date[]): Date;
  static getDataExtent(
    extent: DomainExtent,
    values: ToArray<VicContinuousValue>,
    domainIncludesZero?: boolean
  ): VicContinuousValue;
  static getDataExtent(
    extent: DomainExtent,
    values: ToArray<VicContinuousValue>,
    domainIncludesZero?: boolean
  ): VicContinuousValue {
    const valueFn = extent === 'max' ? max : min;
    const dataMin = valueFn<Numeric>(values) as VicContinuousValue;
    if (isNumber(dataMin)) {
      return domainIncludesZero ? valueFn([dataMin, 0]) : dataMin;
    } else {
      return dataMin;
    }
  }

  static getPaddedDomain(
    unpaddedDomain: [VicContinuousValue, VicContinuousValue],
    domainPadding: VicDomainPaddingConfig,
    scaleType?: any,
    chartRange?: [number, number]
  ): [VicContinuousValue, VicContinuousValue] {
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
    if (domainMin === domainMax) {
      return [domainMin, domainMin + 1];
    } else {
      return [domainMin, domainMax];
    }
  }

  static getPaddedDomainValue(
    unpaddedDomain: [VicContinuousValue, VicContinuousValue],
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
