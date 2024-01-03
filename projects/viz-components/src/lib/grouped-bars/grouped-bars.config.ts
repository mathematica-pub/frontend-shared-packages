import { VicBarsConfig } from '../bars/bars.config';

export class VicGroupedBarsConfig extends VicBarsConfig {
  intraGroupPadding: number;
  constructor(init?: Partial<VicGroupedBarsConfig>) {
    super();
    this.intraGroupPadding = 0.05;
    Object.assign(this, init);
  }
}
