import { TimeInterval } from 'd3';
import { TickWrapConfig } from '../svg-text-wrap/tick-wrap-config';

export class AxisConfig {
  numTicks?: number | TimeInterval;
  tickFormat?: string;
  tickValues?: any[];
  removeDomain?: boolean;
  removeTicks?: boolean;
  removeTickMarks?: boolean;
  showGridLines?: boolean;
  wrap?: TickWrapConfig;
  tickSizeOuter?: number;
  tickLabelFontSize?: number;
  constructor(init?: Partial<AxisConfig>) {
    Object.assign(this, init);
  }
}
