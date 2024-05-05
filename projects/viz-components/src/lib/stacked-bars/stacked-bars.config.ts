import { schemeTableau10, stackOffsetDiverging, stackOrderNone } from 'd3';
import { VicBarsConfig } from '../bars/bars.config';
import { VicDataValue } from '../data-marks/dimensions/data-dimension';

export class VicStackedBarsConfig<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsConfig<Datum, TOrdinalValue> {
  order: any;
  offset: any;

  constructor(init?: Partial<VicStackedBarsConfig<Datum, TOrdinalValue>>) {
    super();
    this.order = stackOrderNone;
    this.offset = stackOffsetDiverging;
    this.categorical.range = schemeTableau10 as string[];
    Object.assign(this, init);
  }
}
