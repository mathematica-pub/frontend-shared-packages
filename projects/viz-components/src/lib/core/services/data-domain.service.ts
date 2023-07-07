import { Injectable } from '@angular/core';
import { DomainPaddingConfig } from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';

@Injectable({
  providedIn: 'root',
})
export class DataDomainService {
  getPaddedDomainValue(value: number, padding: DomainPaddingConfig) {
    let paddedValue = value;
    if (padding.type === 'roundUp') {
      paddedValue = this.getQuantitativeDomainMaxRoundedUp(
        value,
        padding.sigDigits(value)
      );
    } else if (padding.type === 'percentOver') {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.sigDigits(value),
        padding.percentOver
      );
    } else if (padding.type === 'roundTo') {
      paddedValue = ValueUtilities.getValueRoundedTo(value, padding.roundUpTo);
    }
    return paddedValue;
  }

  getQuantitativeDomainMaxRoundedUp(value: number, sigDigits: number) {
    return ValueUtilities.getValueRoundedUpNSignificantDigits(value, sigDigits);
  }

  getQuantitativeDomainMaxPercentOver(
    value: number,
    sigDigits: number,
    percent: number
  ) {
    const overValue = value * (1 + percent);
    return ValueUtilities.getValueRoundedUpNSignificantDigits(
      overValue,
      sigDigits
    );
  }
}
