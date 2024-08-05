import { format, timeFormat } from 'd3';
import { ValueExtent } from '../types/values';
import { isDate } from './type-guards';
export type VicFormatSpecifier<Datum> = string | ((x: Datum) => string);

/**
 * @internal
 */
export class ValueUtilities {
  static getValueRoundedToNSignificantFigures(
    value: number,
    sigFigures: number,
    valueExtent: keyof typeof ValueExtent
  ): number {
    // If the value type is VicValueExtent.max, rounds up if value is > 0 and down if value is < 0
    // If the value type is VicValueExtent.min, rounds down if value is > 0 and up if value is < 0
    // ex: 1234 => 1235, -1234 => -1235
    // SigDigits here means the first N non-zero as units holder values
    // ex: 1234, sigFigures = 2, "1" and "2" are "significant"
    // ex: 0.001234, sigFigures = 3, "1", "2", and "3" are "significant"
    this.validateSigFigures(sigFigures);
    let absRoundedValue;
    if (Math.abs(value) < 1) {
      absRoundedValue = this.getRoundedDecimalLessThanOne(
        value,
        sigFigures,
        valueExtent
      );
    } else {
      const absValueStr = Math.abs(value).toString();
      const decimalIndex = absValueStr.indexOf('.');
      let firstNDigits;
      let numZeros = 0;
      if (decimalIndex < sigFigures && decimalIndex > -1) {
        firstNDigits = absValueStr.substring(0, sigFigures + 1);
      } else {
        firstNDigits = absValueStr.substring(0, sigFigures);
        if (decimalIndex > -1) {
          numZeros = decimalIndex - sigFigures;
        } else {
          numZeros = absValueStr.length - sigFigures;
        }
        numZeros = numZeros < 0 ? 0 : numZeros;
      }
      const offset = this.getRoundingOffset(value, valueExtent);
      const lastSigDigit = Number(firstNDigits[firstNDigits.length - 1]);
      // handle cases where the last rounded significant is 9 and the value is rounded up
      if (offset === 1 && lastSigDigit === 9) {
        firstNDigits = this.getNewValueForNine(
          value,
          firstNDigits.split(''),
          absValueStr,
          sigFigures,
          valueExtent
        );
        if (firstNDigits[0] === '0') {
          firstNDigits.unshift('1');
        }
        firstNDigits = firstNDigits.join('');
      } else {
        firstNDigits =
          firstNDigits.substring(0, firstNDigits.length - 1) +
          (lastSigDigit + offset).toString();
      }
      absRoundedValue = Number(firstNDigits + '0'.repeat(numZeros));
    }
    return value >= 0 || absRoundedValue === 0
      ? absRoundedValue
      : -absRoundedValue;
  }

  private static validateSigFigures(sigFigures: number): void {
    if (sigFigures < 1) {
      throw new Error('sigFigures must be greater than or equal to 1');
    }
  }

  private static getRoundedDecimalLessThanOne(
    value: number,
    sigFigures: number,
    valueExtent: keyof typeof ValueExtent
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
        if (sigDigitsFound <= sigFigures) {
          let newDigit = '0';
          if (sigDigitsFound === sigFigures || i === valueStr.length - 1) {
            if (char === '9') {
              newValue = this.getNewValueForNine(
                value,
                newValue,
                valueStr,
                i,
                valueExtent
              );
            } else {
              const offset = this.getRoundingOffset(value, valueExtent);
              newDigit = `${Number(char) + offset}`;
            }
          } else if (sigDigitsFound < sigFigures) {
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
    valueExtent: keyof typeof ValueExtent
  ): string[] {
    const prevChar = valueStr[i - 1];
    if (prevChar === '9') {
      newValue[i - 1] = '0';
      newValue = this.getNewValueForNine(
        value,
        newValue,
        valueStr,
        i - 1,
        valueExtent
      );
    } else if (prevChar === '.') {
      newValue = this.getNewValueForNine(
        value,
        newValue,
        valueStr,
        i - 1,
        valueExtent
      );
    } else {
      const offset = this.getRoundingOffset(value, valueExtent);
      newValue[i - 1] = `${Number(prevChar) + offset}`;
    }
    return newValue;
  }

  private static getRoundingOffset(
    value: number,
    valueExtent: keyof typeof ValueExtent
  ): number {
    return (value > 0 && valueExtent === ValueExtent.max) ||
      (value < 0 && valueExtent === ValueExtent.min)
      ? 1
      : 0;
  }

  static getValueRoundedToInterval(
    value: number,
    interval: number,
    valueExtent: keyof typeof ValueExtent
  ): number {
    if (interval === 0) {
      return value;
    }
    const round = valueExtent === ValueExtent.max ? Math.ceil : Math.floor;
    return round(value / interval) * interval;
  }

  static d3Format(value: Date | number, formatter: string): string {
    return formatter
      ? isDate(value)
        ? timeFormat(formatter)(value)
        : format(formatter)(value)
      : value.toString();
  }

  static customFormat<Datum>(
    value: Datum,
    formatter: (x: Datum) => string
  ): string {
    return formatter ? formatter(value) : value.toString();
  }
}
