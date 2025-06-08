import { Series } from 'd3';
import { BarsOptions } from '../../bars/config/bars-options';
import { DataValue } from '../../core/types/values';

export interface StackedBarsOptions<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue,
> extends BarsOptions<Datum, OrdinalDomain, ChartMultipleDomain> {
  stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrder: (x: any) => any;
}
