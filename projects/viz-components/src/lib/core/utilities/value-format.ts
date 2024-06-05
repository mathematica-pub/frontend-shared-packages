export type VicFormatSpecifier<T> = string | ((x: T) => string);

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
