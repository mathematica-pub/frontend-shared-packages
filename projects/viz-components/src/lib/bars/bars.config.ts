import { scaleLinear } from 'd3';
import {
  CategoricalColorDimensionConfig,
  OrdinalDimensionConfig,
  QuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import {
  DataMarksConfig,
  PatternPredicate,
} from '../data-marks/data-marks.config';

export class BarsConfig extends DataMarksConfig {
  ordinal: OrdinalDimensionConfig = new OrdinalDimensionConfig();
  quantitative: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
  category: CategoricalColorDimensionConfig =
    new CategoricalColorDimensionConfig();
  dimensions: BarsDimensionsConfig;
  labels: BarsLabelsConfig;
  positivePaddingForAllNegativeValues: number;
  patternPredicates?: PatternPredicate[];

  constructor(init?: Partial<BarsConfig>) {
    super();
    this.dimensions = new VerticalBarChartDimensionsConfig();
    this.ordinal.valueAccessor = (d, i) => i;
    this.quantitative.valueAccessor = (d) => d;
    this.quantitative.scaleType = scaleLinear;
    this.category.valueAccessor = (d) => d;
    this.category.colors = ['lightslategray'];
    this.positivePaddingForAllNegativeValues = 0.2;
    Object.assign(this, init);
  }
}

export class BarsLabelsConfig {
  display: boolean;
  offset: number;
  color?: string;
  noValueFunction: (d) => string;

  constructor(init?: Partial<BarsLabelsConfig>) {
    this.display = true;
    this.offset = 4;
    this.noValueFunction = (d) => 'N/A';
    Object.assign(this, init);
  }
}

export class BarsTooltipData {
  datum: any;
  value: string;
}

export class BarsDimensionsConfig {
  direction: 'vertical' | 'horizontal';
  x: 'ordinal' | 'quantitative';
  y: 'ordinal' | 'quantitative';
  ordinal: 'x' | 'y';
  quantitative: 'x' | 'y';
  quantitativeDimension: 'width' | 'height';
}

export class HorizontalBarsDimensionsConfig extends BarsDimensionsConfig {
  constructor() {
    super();
    this.direction = 'horizontal';
    this.x = 'quantitative';
    this.y = 'ordinal';
    this.ordinal = 'y';
    this.quantitative = 'x';
    this.quantitativeDimension = 'width';
  }
}

export class VerticalBarChartDimensionsConfig extends BarsDimensionsConfig {
  constructor() {
    super();
    this.direction = 'vertical';
    this.x = 'ordinal';
    this.y = 'quantitative';
    this.ordinal = 'x';
    this.quantitative = 'y';
    this.quantitativeDimension = 'height';
  }
}
