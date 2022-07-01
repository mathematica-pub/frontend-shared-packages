import { TimeInterval } from 'd3';
import { SvgWrapOptions } from '../shared/svg-utilities.model';

export class AxisConfig {
  dimensionType: 'quantitative' | 'ordinal';
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

export class QuantitativeAxisConfig extends AxisConfig {
  constructor() {
    super();
    this.dimensionType = 'quantitative';
    this.tickFormat = ',.1f';
  }
}

export class OrdinalAxisConfig extends AxisConfig {
  constructor() {
    super();
    this.dimensionType = 'ordinal';
  }
}

export class TickWrap extends SvgWrapOptions {
  wrapWidth: 'bandwidth' | number;
  override width: never;
}
