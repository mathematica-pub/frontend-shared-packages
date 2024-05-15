import { Injectable } from '@angular/core';
import {
  DomainPadding,
  VicDomainPaddingConfig,
} from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';
import { VicValueExtent } from '../types/values';

@Injectable({
  providedIn: 'root',
})
export class DataDomainService {
  getPaddedDomainValue(
    unpaddedDomain: [number, number],
    padding: VicDomainPaddingConfig,
    valueExtent: VicValueExtent,
    scaleType?: any,
    pixelRange?: [number, number]
  ) {
    let paddedValue =
      valueExtent === VicValueExtent.min
        ? unpaddedDomain[0]
        : unpaddedDomain[1];
    const value = paddedValue;
    if (padding.type === DomainPadding.roundUp) {
      paddedValue = this.getQuantitativeDomainMaxRoundedUp(
        value,
        padding.sigDigits(value),
        valueExtent
      );
    } else if (padding.type === DomainPadding.percentOver) {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.sigDigits(value),
        padding.percentOver,
        valueExtent
      );
    } else if (padding.type === DomainPadding.roundInterval) {
      paddedValue = ValueUtilities.getValueRoundedToInterval(
        value,
        padding.interval(value),
        valueExtent
      );
    } else if (padding.type === DomainPadding.numPixels) {
      paddedValue = this.getPixelPaddedDomainValue(
        unpaddedDomain,
        padding.numPixels,
        valueExtent,
        scaleType,
        pixelRange
      );
    }
    return paddedValue;
  }

  getPixelPaddedDomainValue(
    unpaddedDomain: [number, number],
    numPixels: number,
    valueExtent: VicValueExtent,
    scaleType: any,
    pixelRange: [number, number]
  ): number {
    if (pixelRange[1] < pixelRange[0]) numPixels = -1 * numPixels;
    const value =
      valueExtent === VicValueExtent.min
        ? unpaddedDomain[0]
        : unpaddedDomain[1];
    if (value === 0) return value;
    const adjustedPixelRange =
      valueExtent === VicValueExtent.min && unpaddedDomain[0] < 0
        ? [pixelRange[0] + numPixels, pixelRange[1]]
        : [pixelRange[0], pixelRange[1] - numPixels];
    const scale = scaleType(unpaddedDomain, adjustedPixelRange);
    const targetVal =
      valueExtent === VicValueExtent.min ? pixelRange[0] : pixelRange[1];
    return scale.invert(targetVal);
  }

  getQuantitativeDomainMaxRoundedUp(
    value: number,
    sigDigits: number,
    valueExtent: VicValueExtent
  ): number {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      value,
      sigDigits,
      valueExtent
    );
  }

  getQuantitativeDomainMaxPercentOver(
    value: number,
    sigDigits: number,
    percent: number,
    valueExtent: VicValueExtent
  ): number {
    let overValue = Math.abs(value) * (1 + percent);
    if (value < 0) overValue = -overValue;
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      overValue,
      sigDigits,
      valueExtent
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
          VicValueExtent.min,
          scaleType,
          pixelRange
        )
      : unpaddedDomain[0];
    const domainMax = domainPadding
      ? this.getPaddedDomainValue(
          unpaddedDomain,
          domainPadding,
          VicValueExtent.max,
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
