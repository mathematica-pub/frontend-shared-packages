import { Injectable } from '@angular/core';
import { VicDomainPaddingConfig } from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';

export type ValueType = 'max' | 'min';

@Injectable({
  providedIn: 'root',
})
export class DataDomainService {
  getPaddedDomainValue(
    unpaddedDomain: [number, number],
    padding: VicDomainPaddingConfig,
    valueType: ValueType,
    scaleType?: any,
    pixelRange?: [number, number]
  ) {
    let paddedValue =
      valueType === 'min' ? unpaddedDomain[0] : unpaddedDomain[1];
    const value = paddedValue;
    if (padding.type === 'roundUp') {
      paddedValue = this.getQuantitativeDomainMaxRoundedUp(
        value,
        padding.sigDigits(value),
        valueType
      );
    } else if (padding.type === 'percentOver') {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.sigDigits(value),
        padding.percentOver,
        valueType
      );
    } else if (padding.type === 'roundInterval') {
      paddedValue = ValueUtilities.getValueRoundedToInterval(
        value,
        padding.interval(value),
        valueType
      );
    } else if (padding.type === 'numPixels') {
      paddedValue = this.getPixelPaddedDomainValue(
        unpaddedDomain,
        padding.numPixels,
        valueType,
        scaleType,
        pixelRange
      );
    }
    return paddedValue;
  }

  getPixelPaddedDomainValue(
    unpaddedDomain: [number, number],
    numPixels: number,
    valueType: ValueType,
    scaleType: any,
    pixelRange: [number, number]
  ): number {
    if (pixelRange[1] < pixelRange[0]) numPixels = -1 * numPixels;
    const value = valueType === 'min' ? unpaddedDomain[0] : unpaddedDomain[1];
    if (value === 0) return value;
    const adjustedPixelRange =
      valueType === 'min' && unpaddedDomain[0] < 0
        ? [pixelRange[0] + numPixels, pixelRange[1]]
        : [pixelRange[0], pixelRange[1] - numPixels];
    const scale = scaleType(unpaddedDomain, adjustedPixelRange);
    const targetVal = valueType === 'min' ? pixelRange[0] : pixelRange[1];
    return scale.invert(targetVal);
  }

  getQuantitativeDomainMaxRoundedUp(
    value: number,
    sigDigits: number,
    valueType: ValueType
  ): number {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      value,
      sigDigits,
      valueType
    );
  }

  getQuantitativeDomainMaxPercentOver(
    value: number,
    sigDigits: number,
    percent: number,
    valueType: ValueType
  ): number {
    let overValue = Math.abs(value) * (1 + percent);
    if (value < 0) overValue = -overValue;
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      overValue,
      sigDigits,
      valueType
    );
  }

  getQuantitativeDomain(
    unpaddedDomain: [number, number],
    domainPadding: VicDomainPaddingConfig,
    scaleType?: any,
    pixelRange?: [number, number]
  ): [number, number] {
    const domainMin = domainPadding
      ? this.getPaddedDomainValue(
          unpaddedDomain,
          domainPadding,
          'min',
          scaleType,
          pixelRange
        )
      : unpaddedDomain[0];
    const domainMax = domainPadding
      ? this.getPaddedDomainValue(
          unpaddedDomain,
          domainPadding,
          'max',
          scaleType,
          pixelRange
        )
      : unpaddedDomain[1];
    if (domainMin === domainMax) {
      return [domainMin, domainMin + 1];
    } else {
      return [domainMin, domainMax];
    }
  }
}
