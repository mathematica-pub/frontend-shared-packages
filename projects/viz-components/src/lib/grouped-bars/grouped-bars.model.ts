import { BarsConfig } from '../bars/bars.model';

export class GroupedBarsConfig extends BarsConfig {
  intraGroupPadding: number;
  constructor(init?: Partial<GroupedBarsConfig>) {
    super();
    this.intraGroupPadding = 0.05;
    Object.assign(this, init);
  }
}
