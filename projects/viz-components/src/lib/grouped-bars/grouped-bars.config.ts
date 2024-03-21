import { VicBarsConfig } from '../bars/bars.config';

export class VicGroupedBarsConfig<Datum> extends VicBarsConfig<Datum> {
  intraGroupPadding: number;
  constructor(init?: Partial<VicGroupedBarsConfig<Datum>>) {
    super();
    this.intraGroupPadding = 0.05;
    Object.assign(this, init);
  }
}
