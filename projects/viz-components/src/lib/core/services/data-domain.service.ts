import {
  DomainPadding,
  VicDomainPaddingConfig,
} from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';

export type DomainExtent = 'max' | 'min';

export class QuantitativeDomainUtilities {
  static getPaddedDomain(
    unpaddedDomain: [number, number],
    domainPadding: VicDomainPaddingConfig,
    scaleType?: any,
    pixelRange?: [number, number]
  ): [number, number] {
    const domainMin = this.getPaddedDomainValue(
      unpaddedDomain,
      domainPadding,
      'min',
      scaleType,
      pixelRange
    );
    const domainMax = this.getPaddedDomainValue(
      unpaddedDomain,
      domainPadding,
      'max',
      scaleType,
      pixelRange
    );
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
    scaleType?: any,
    pixelRange?: [number, number]
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
        pixelRange
      );
    }
    return paddedValue;
  }

  static getPixelPaddedDomainValue(
    unpaddedDomain: [number, number],
    numPixels: number,
    valueType: DomainExtent,
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
