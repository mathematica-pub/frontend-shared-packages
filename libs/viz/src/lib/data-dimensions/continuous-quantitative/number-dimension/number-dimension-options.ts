import { ScaleContinuousNumeric } from 'd3';
import { DataDimensionOptions } from '../../dimension-options';

export interface NumberDimensionOptions<Datum, Range>
  extends DataDimensionOptions<Datum, number> {
  domain: [number, number];
  formatSpecifier: string;
  includeZeroInDomain: boolean;
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<Range>
  ) => ScaleContinuousNumeric<Range, Range>;
}
