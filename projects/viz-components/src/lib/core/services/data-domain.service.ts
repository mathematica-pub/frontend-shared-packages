import { Injectable } from '@angular/core';
import { DomainPaddingConfig } from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';

@Injectable({
  providedIn: 'root',
})
export class DataDomainService {
  getPaddedDomainValue(
    value: number,
    padding: DomainPaddingConfig,
    domainType: 'min' | 'max'
  ) {
    let paddedValue = value;
    if (padding.type === 'roundUp') {
      paddedValue = this.getQuantitativeDomainMaxRoundedUp(
        value,
        padding.sigDigits(value),
        domainType
      );
    } else if (padding.type === 'percentOver') {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.sigDigits(value),
        padding.percentOver,
        domainType
      );
    } else if (padding.type === 'roundInterval') {
      paddedValue = ValueUtilities.getValueRoundedToInterval(
        value,
        padding.interval(value),
        domainType
      );
    }
    return paddedValue;
  }

  getQuantitativeDomainMaxRoundedUp(
    value: number,
    sigDigits: number,
    domainType: 'min' | 'max'
  ) {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      value,
      sigDigits,
      domainType
    );
  }

  getQuantitativeDomainMaxPercentOver(
    value: number,
    sigDigits: number,
    percent: number,
    domainType: 'min' | 'max'
  ) {
    const overValue = Math.abs(value) * (1 + percent);
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      overValue,
      sigDigits,
      domainType
    );
  }

  getQuantitativeDomainMinAndMax(
    dataMin: number,
    dataMax: number,
    domainPadding: DomainPaddingConfig
  ): [number, number] {
    const domainMin = domainPadding
      ? this.getPaddedDomainValue(dataMin, domainPadding, 'min')
      : dataMin;
    const domainMax = domainPadding
      ? this.getPaddedDomainValue(dataMax, domainPadding, 'max')
      : dataMax;
    if (domainMin === domainMax) {
      return [domainMin, domainMin + 1];
    } else {
      return [domainMin, domainMax];
    }
  }
}
