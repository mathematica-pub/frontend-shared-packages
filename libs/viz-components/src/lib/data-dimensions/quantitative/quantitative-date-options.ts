import { ScaleTime } from 'd3';
import { DataDimensionOptions } from '../dimension-options';

export interface QuantitativeDateDimensionOptions<Datum>
  extends DataDimensionOptions<Datum, Date> {
  /**
   * An optional, user-provided range of values that is used as the domain of the dimension's scale.
   *
   * If not provided by the user, it remains undefined.
   */
  domain: [Date, Date];
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  readonly formatSpecifier: string;
  /**
   * The scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   */
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;
}
