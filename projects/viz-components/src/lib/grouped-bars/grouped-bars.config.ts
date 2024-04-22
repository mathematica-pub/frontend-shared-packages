import { VicBarsConfig } from '../bars/bars.config';
import { VicDataValue } from '../data-marks/data-dimension.config';

export class VicGroupedBarsConfig<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsConfig<Datum, TOrdinalValue> {
  intraGroupPadding: number;
  constructor(init?: Partial<VicGroupedBarsConfig<Datum, TOrdinalValue>>) {
    super();
    this.intraGroupPadding = 0.05;
    Object.assign(this, init);
  }
}
