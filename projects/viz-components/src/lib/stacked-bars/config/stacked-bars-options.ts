import { Series } from 'd3';
import { VicDataValue } from 'projects/viz-components/src/public-api';
import { VicBarsOptions } from '../../bars/config/bars-options';

export interface VicStackedBarsOptions<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsOptions<Datum, TOrdinalValue> {
  stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrder: (x: any) => any;
}
