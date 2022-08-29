import { Injectable } from '@angular/core';
import { DomainPaddingConfig } from '../../data-marks/data-dimension.config';
import { ValueUtilities } from '../../shared/value-utilities.class';

@Injectable({
  providedIn: 'root',
})
export class DataDomainService {
  getPaddedDomainValue(value: number, padding: DomainPaddingConfig) {
    let paddedValue = value;
    if (padding.type === 'round') {
      paddedValue = this.getQuantitativeDomainMaxRoundedUp(
        value,
        padding.sigDigits
      );
    } else if (padding.type === 'percent') {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.sigDigits,
        padding.percent
      );
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
