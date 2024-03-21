import { schemeTableau10, stackOffsetDiverging, stackOrderNone } from 'd3';
import { VicBarsConfig } from '../bars/bars.config';

export class VicStackedBarsConfig<Datum> extends VicBarsConfig<Datum> {
  order: any;
  offset: any;

  constructor(init?: Partial<VicStackedBarsConfig<Datum>>) {
    super();
    this.order = stackOrderNone;
    this.offset = stackOffsetDiverging;
    this.category.colors = schemeTableau10 as string[];
    Object.assign(this, init);
  }
}
