import { VicBarsConfig } from '../bars/bars.config';

export class VicGroupedBarsConfig<T> extends VicBarsConfig<T> {
  intraGroupPadding: number;
  constructor(init?: Partial<VicGroupedBarsConfig<T>>) {
    super();
    this.intraGroupPadding = 0.05;
    Object.assign(this, init);
  }
}
