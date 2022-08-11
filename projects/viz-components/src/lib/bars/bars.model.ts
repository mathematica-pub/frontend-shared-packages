import { scaleLinear } from 'd3';
import {
  CategoricalColorDimension,
  OrdinalDimension,
  QuantitativeDimension,
} from '../data-marks/data-dimension.model';
import { DataMarksConfig } from '../data-marks/data-marks.model';

export class BarsConfig extends DataMarksConfig {
  ordinal: OrdinalDimension = new OrdinalDimension();
  quantitative: QuantitativeDimension = new QuantitativeDimension();
  category: CategoricalColorDimension = new CategoricalColorDimension();
  dimensions: BarsDimensionsConfig;
  labels: LabelsConfig;
  positivePaddingForAllNegativeValues: number;

  constructor(init?: Partial<BarsConfig>) {
    super();
    this.dimensions = verticalBarChartDimensionsConfig;
    this.ordinal.valueAccessor = (d, i) => i;
    this.quantitative.valueAccessor = (d) => d;
    this.quantitative.scaleType = scaleLinear;
    this.category.valueAccessor = (d) => d;
    this.category.colors = ['lightslategray'];
    this.labels = new LabelsConfig();
    this.positivePaddingForAllNegativeValues = 0.2;
    Object.assign(this.category, init);
  }
}

export class LabelsConfig {
  show: boolean;
  offset: number;
  color?: string;
  noValueString: string;

  constructor(init?: Partial<LabelsConfig>) {
    this.show = false;
    this.offset = 4;
    this.noValueString = 'N/A';
    Object.assign(this, init);
  }
}

export class BarsTooltipData {
  datum: any;
  value: string;
}

export interface BarsDimensionsConfig {
  direction: 'vertical' | 'horizontal';
  x: 'ordinal' | 'quantitative';
  y: 'ordinal' | 'quantitative';
  ordinal: 'x' | 'y';
  quantitative: 'x' | 'y';
  quantitativeDimension: 'width' | 'height';
}

export const horizontalBarChartDimensionsConfig: BarsDimensionsConfig = {
  direction: 'horizontal',
  x: 'quantitative',
  y: 'ordinal',
  ordinal: 'y',
  quantitative: 'x',
  quantitativeDimension: 'width',
};

export const verticalBarChartDimensionsConfig: BarsDimensionsConfig = {
  direction: 'vertical',
  x: 'ordinal',
  y: 'quantitative',
  ordinal: 'x',
  quantitative: 'y',
  quantitativeDimension: 'height',
};
