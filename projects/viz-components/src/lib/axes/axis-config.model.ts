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
}
export class TickWrap extends SvgWrapOptions {
  wrapWidth: 'bandwidth' | number;
  override width: never;
}
