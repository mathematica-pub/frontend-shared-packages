import { NumberDimensionOptions } from '../number-dimension/number-dimension-options';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';

export interface NumberChartPositionDimensionOptions<Datum>
  extends NumberDimensionOptions<Datum, number> {
  domainPadding?: ConcreteDomainPadding;
}
