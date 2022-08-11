import { TimeInterval } from 'd3';
import { SvgWrapOptions } from '../shared/svg-utilities.model';

export class AxisConfig {
  numTicks?: number | TimeInterval;
  tickFormat?: string;
  tickValues?: any[];
  removeDomain?: boolean;
  removeTicks?: boolean;
  removeTickMarks?: boolean;
  showGridLines?: boolean;
  wrap?: TickWrap;
  tickSizeOuter?: number;
  tickLabelFontSize?: number;
  constructor(init?: Partial<AxisConfig>) {
    Object.assign(this, init);
  }
}
export class TickWrap extends SvgWrapOptions {
  wrapWidth: 'bandwidth' | number;
  override width: never;
  constructor(init?: Partial<TickWrap>) {
    super();
    Object.assign(this, init);
  }
}
