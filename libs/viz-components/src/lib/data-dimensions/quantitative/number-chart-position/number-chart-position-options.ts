import { ScaleContinuousNumeric } from 'd3';
import { DataDimensionOptions } from '../../dimension-options';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';

export interface NumberChartPositionDimensionOptions<Datum>
  extends DataDimensionOptions<Datum, number> {
  domain: [number, number];
  formatSpecifier: string;
  /**
   * A user-configurable boolean that indicates whether the domain of the dimension's scale should include zero.
   */
  includeZeroInDomain: boolean;
  /**
   * The padding configuration for the dimension's domain.
   */
  domainPadding?: ConcreteDomainPadding;
  /**
   * The scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   */
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
}
