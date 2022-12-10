import { format, timeFormat } from 'd3';

export type FormatSpecifier = string | ((x: unknown) => string);

export interface ValueFormats {
  integer: string;
  integerNoComma: string;
  percent: (digits: number) => string;
  decimal: (digits: number) => string;
  decimalNoComma: (digits: number) => string;
  fullYear: string;
  monthYear: string;
  monthFullYear: string;
}

export const valueFormat: ValueFormats = {
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
  formatSpecifier: FormatSpecifier
): string {
  if (formatSpecifier && typeof formatSpecifier === 'string') {
    const formatter = value instanceof Date ? timeFormat : format;
    return formatter(formatSpecifier)(value);
  } else if (formatSpecifier && typeof formatSpecifier === 'function') {
    return formatSpecifier(value);
  } else {
    return value.toString();
  }
}
