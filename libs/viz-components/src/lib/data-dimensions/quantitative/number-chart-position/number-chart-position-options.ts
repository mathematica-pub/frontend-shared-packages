import { NumberVisualValueDimensionOptions } from '../number-visual-value/number-visual-value-options';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';

export interface NumberChartPositionDimensionOptions<Datum>
  extends NumberVisualValueDimensionOptions<Datum> {
  /**
   * The padding configuration for the dimension's domain.
   */
  domainPadding?: ConcreteDomainPadding;
}
