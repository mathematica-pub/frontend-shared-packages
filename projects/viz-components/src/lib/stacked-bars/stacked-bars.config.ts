import { schemeTableau10, stackOffsetDiverging, stackOrderNone } from 'd3';
import { VicBarsConfig } from '../bars/bars.config';
import { VicDataValue } from '../data-marks/data-dimension.config';

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
    this.category.colors = schemeTableau10 as string[];
    Object.assign(this, init);
  }
}
