import { ValueType } from '../core/services/data-domain.service';

/**
 * @internal
 */
export class ValueUtilities {
  static getValueRoundedToNSignificantDigits(
    value: number,
    sigDigits: number,
    valueType: ValueType
  ): number {
    // If the value type is 'max', rounds up if value is > 0 and down if value is < 0
    // If the value type is 'min', rounds down if value is > 0 and up if value is < 0
    // ex: 1234 => 1235, -1234 => -1235
    // SigDigits here means the first N non-zero as units holder values
    // ex: 1234, sigDigits = 2, "1" and "2" are "significant"
    // ex: 0.001234, sigDigits = 3, "1", "2", and "3" are "significant"
    this.validateSigDigits(sigDigits);
    let absRoundedValue;
    if (Math.abs(value) < 1) {
      absRoundedValue = this.getRoundedDecimalLessThanOne(
        value,
        sigDigits,
        valueType
      );
    } else {
      const absValueStr = Math.abs(value).toString();
      const decimalIndex = absValueStr.indexOf('.');
      let firstNDigits;
      let numZeros = 0;
      if (decimalIndex < sigDigits && decimalIndex > -1) {
        firstNDigits = absValueStr.substring(0, sigDigits + 1);
      } else {
        firstNDigits = absValueStr.substring(0, sigDigits);
        if (decimalIndex > -1) {
          numZeros = decimalIndex - sigDigits;
        } else {
          numZeros = absValueStr.length - sigDigits;
        }
        numZeros = numZeros < 0 ? 0 : numZeros;
      }
      const offset = this.getRoundingOffset(value, valueType);
      const roundedLastSigDigit =
        Number(firstNDigits[firstNDigits.length - 1]) + offset;
      firstNDigits =
        firstNDigits.substring(0, firstNDigits.length - 1) +
        roundedLastSigDigit.toString();
      absRoundedValue = Number(firstNDigits + '0'.repeat(numZeros));
    }
    return value >= 0 || absRoundedValue === 0
      ? absRoundedValue
      : -absRoundedValue;
  }

  private static validateSigDigits(sigDigits: number): void {
    if (sigDigits < 1) {
      throw new Error('sigDigits must be greater than or equal to 1');
    }
  }

  private static getRoundedDecimalLessThanOne(
    value: number,
    sigDigits: number,
    valueType: ValueType
  ): number {
    const valueStr = Math.abs(value).toString();
    let newValue = [];
    let sigDigitsFound = 0;
    for (let i = 0; i < valueStr.length; i++) {
      const char = valueStr[i];
      if (char === '.' || (char === '0' && sigDigitsFound === 0)) {
        newValue.push(char);
      } else {
        ++sigDigitsFound;
        if (sigDigitsFound <= sigDigits) {
          let newDigit = '0';
          if (sigDigitsFound === sigDigits || i === valueStr.length - 1) {
            if (char === '9') {
              newValue = this.getNewValueForNine(
                value,
                newValue,
                valueStr,
                i,
                valueType
              );
            } else {
              const offset = this.getRoundingOffset(value, valueType);
              newDigit = `${Number(char) + offset}`;
            }
          } else if (sigDigitsFound < sigDigits) {
            newDigit = char;
          }
          newValue.push(newDigit);
        }
      }
    }
    return parseFloat(newValue.join(''));
  }

  private static getNewValueForNine(
    value: number,
    newValue: string[],
    valueStr: string,
    i: number,
    valueType: ValueType
  ): string[] {
    const prevChar = valueStr[i - 1];
    if (prevChar === '9') {
      newValue[i - 1] = '0';
      newValue = this.getNewValueForNine(
        value,
        newValue,
        valueStr,
        i - 1,
        valueType
      );
    } else if (prevChar === '.') {
      newValue = this.getNewValueForNine(
        value,
        newValue,
        valueStr,
        i - 1,
        valueType
      );
    } else {
      const offset = this.getRoundingOffset(value, valueType);
      newValue[i - 1] = `${Number(prevChar) + offset}`;
    }
    return newValue;
  }

  private static getRoundingOffset(
    value: number,
    valueType: ValueType
  ): number {
    return (value > 0 && valueType === 'max') ||
      (value < 0 && valueType === 'min')
      ? 1
      : 0;
  }

  static getValueRoundedToInterval(
    value: number,
    interval: number,
    valueType: ValueType
  ): number {
    if (interval === 0) {
      return value;
    }

    const round = ValueUtilities.getRoundingMethod(value, valueType);
    return round(value / interval) * interval;
  }

  private static getRoundingMethod(
    value: number,
    valueType: ValueType
  ): (value: number) => number {
    let operator;
    if (value > 0) {
      operator = valueType === 'max' ? Math.ceil : Math.floor;
    } else {
      operator = valueType === 'max' ? Math.floor : Math.ceil;
    }
    return operator;
  }
}
