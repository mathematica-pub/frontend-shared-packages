import { TimeInterval } from 'd3';
import { SvgWrapOptions } from '../shared/svg-utilities.model';

export class AxisConfig {
  dimensionType: 'quantitative' | 'ordinal';
  tickFormat?: string;
  numTicks?: number | TimeInterval;
  tickValues?: any[];
  removeDomain?: boolean;
  removeTicks?: boolean;
  removeTickMarks?: boolean;
  showGridLines?: boolean;
  wrap?: TickWrap;
  tickSizeOuter?: number;
  tickLabelFontSize?: number;
}

export class QuantitativeAxisConfig extends AxisConfig {
  constructor() {
    super();
    this.dimensionType = 'quantitative';
  }
}

export class OrdinalAxisConfig extends AxisConfig {
  constructor() {
    super();
    this.dimensionType = 'ordinal';
    this.tickSizeOuter = 0;
  }
}

export class TickWrap extends SvgWrapOptions {
  wrapWidth: 'bandwidth' | number;
  override width: never;
}
