import { NumberNumberDimensionOptions } from '../number-number/number-number-options';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';

export interface NumberChartPositionDimensionOptions<Datum>
  extends NumberNumberDimensionOptions<Datum> {
  /**
   * The padding configuration for the dimension's domain.
   */
  domainPadding?: ConcreteDomainPadding;
}
