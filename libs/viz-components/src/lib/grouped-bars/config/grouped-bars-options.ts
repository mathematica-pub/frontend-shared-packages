import { BarsOptions } from '../../bars/config/bars-options';
import { DataValue } from '../../core/types/values';

export interface GroupedBarsOptions<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue,
> extends BarsOptions<Datum, OrdinalDomain, ChartMultipleDomain> {
  intraGroupPadding: number;
}
