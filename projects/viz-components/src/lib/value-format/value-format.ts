import { format, timeFormat } from 'd3';
import { isDate } from '../core/utilities/isDate';

export type VicFormatSpecifier = string | ((x: unknown) => string);

export interface VicValueFormats {
  integer: string;
  integerNoComma: string;
  percent: (digits: number) => string;
  decimal: (digits: number) => string;
  decimalNoComma: (digits: number) => string;
  fullYear: string;
  monthYear: string;
  monthFullYear: string;
}

export const valueFormat: VicValueFormats = {
  integer: ',.0f',
  integerNoComma: '.0f',
  percent: (digits: number) => `.${digits}%`,
  decimal: (digits: number) => `,.${digits}f`,
  decimalNoComma: (digits: number) => `.${digits}f`,
  fullYear: '%Y',
  monthYear: '%b %Y',
  monthFullYear: '%B %Y',
};

export function formatValue(
  value: any,
  formatSpecifier: VicFormatSpecifier
): string {
  if (formatSpecifier && typeof formatSpecifier === 'function') {
    return formatSpecifier(value);
  } else if (value === null || value === undefined) {
    return '';
  } else if (formatSpecifier && typeof formatSpecifier === 'string') {
    const formatter = isDate(value) ? timeFormat : format;
    return formatter(formatSpecifier)(value);
  } else {
    return value.toString();
  }
}
