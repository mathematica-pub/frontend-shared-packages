import { VicDataValue } from 'projects/viz-components/src/public-api';
import { VicBarsOptions } from '../../bars/config/bars-options';

export interface VicGroupedBarsOptions<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsOptions<Datum, TOrdinalValue> {
  intraGroupPadding: number;
}
