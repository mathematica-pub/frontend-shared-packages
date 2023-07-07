/**
 * @internal
 */

export class ValueUtilities {
  static getValueRoundedUpNSignificantDigits(
    value: number,
    sigDigits: number
  ): number {
    // Rounds up if value is > 0, down if value is < 0
    // ex: 1234 => 1235, -1234 => -1235
    // SigDigits here means the first N non-zero as units holder values
    // ex: 1234, sigDigits = 2, "1" and "2" are "significant"
    // ex: 0.001234, sigDigits = 3, "1", "2", and "3" are "significant"
    this.validateSigDigits(sigDigits);
    let absRoundedValue;
    const absValueStr = Math.abs(value).toString();
    if (Math.abs(value) < 1) {
      absRoundedValue = this.getRoundedDecimalLessThanOne(
        absValueStr,
        sigDigits
      );
    } else {
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
      const roundedLastSigDigit =
        Number(firstNDigits[firstNDigits.length - 1]) + 1;
      firstNDigits =
        firstNDigits.substring(0, firstNDigits.length - 1) +
        roundedLastSigDigit.toString();
      absRoundedValue = Number(firstNDigits + '0'.repeat(numZeros));
    }
    return value > 0 ? absRoundedValue : -absRoundedValue;
  }

  private static validateSigDigits(sigDigits: number): void {
    if (sigDigits < 1) {
      throw new Error('sigDigits must be greater than or equal to 1');
    }
  }

  private static getRoundedDecimalLessThanOne(
    valueStr: string,
    sigDigits: number
  ): number {
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
              newValue = this.getNewValueForNine(newValue, valueStr, i);
            } else {
              newDigit = `${Number(char) + 1}`;
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
    newValue: string[],
    valueStr: string,
    i: number
  ): string[] {
    const prevChar = valueStr[i - 1];
    if (prevChar === '9') {
      newValue[i - 1] = '0';
      newValue = this.getNewValueForNine(newValue, valueStr, i - 1);
    } else if (prevChar === '.') {
      newValue = this.getNewValueForNine(newValue, valueStr, i - 1);
    } else {
      newValue[i - 1] = `${Number(prevChar) + 1}`;
    }
    return newValue;
  }

  static getValueRoundedTo(value: number, roundTo: number): number {
    const isPositive = value >= 0;

    value = Math.abs(value);
    roundTo = Math.abs(roundTo);

    const quotient = Math.floor(value / roundTo);
    const remainder = value % roundTo;

    const roundingDirection = isPositive ? 1 : -1;

    if (remainder > 0) {
      return (quotient + roundingDirection) * roundTo;
    }

    return value;
  }
}
