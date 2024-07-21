import { Series } from 'd3';
import { BarsOptions } from '../../bars/config/bars-options';
import { DataValue } from '../../core/types/values';

export interface StackedBarsOptions<Datum, TOrdinalValue extends DataValue>
  extends BarsOptions<Datum, TOrdinalValue> {
  stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrder: (x: any) => any;
}
