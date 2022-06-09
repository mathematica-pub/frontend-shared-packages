import { BarsConfig } from '../bars/bars.model';

export class GroupedBarsConfig extends BarsConfig {
  intraGroupPadding: number;
  constructor() {
    super();
    this.intraGroupPadding = 0.05;
  }
}
