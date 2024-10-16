import { ScaleContinuousNumeric } from 'd3';
import { VisualValue } from '../../../core';
import { DataDimensionOptions } from '../../dimension-options';

export interface NumberVisualValueDimensionOptions<
  Datum,
  Range extends VisualValue,
> extends DataDimensionOptions<Datum, number> {
  domain: [number, number];
  formatSpecifier: string;
  includeZeroInDomain: boolean;
  range: Range[];
  scale: (value: number) => Range;
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<Range>
  ) => ScaleContinuousNumeric<Range, Range>;
}
