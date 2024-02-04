import { schemeTableau10, stackOffsetDiverging, stackOrderNone } from 'd3';
import { VicBarsConfig } from '../bars/bars.config';

export class VicStackedBarsConfig<T> extends VicBarsConfig<T> {
  order: any;
  offset: any;

  constructor(init?: Partial<VicStackedBarsConfig<T>>) {
    super();
    this.order = stackOrderNone;
    this.offset = stackOffsetDiverging;
    this.category.colors = schemeTableau10 as string[];
    Object.assign(this, init);
  }
}
