import { scaleLinear } from 'd3';
import {
  VicCategoricalColorDimensionConfig,
  VicOrdinalDimensionConfig,
  VicQuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import {
  VicDataMarksConfig,
  VicPatternPredicate,
} from '../data-marks/data-marks.config';

export class VicBarsConfig extends VicDataMarksConfig {
  ordinal: VicOrdinalDimensionConfig = new VicOrdinalDimensionConfig();
  quantitative: VicQuantitativeDimensionConfig =
    new VicQuantitativeDimensionConfig();
  category: VicCategoricalColorDimensionConfig =
    new VicCategoricalColorDimensionConfig();
  dimensions: VicBarsDimensionsConfig;
  labels: VicBarsLabelsConfig;
  patternPredicates?: VicPatternPredicate[];

  constructor(init?: Partial<VicBarsConfig>) {
    super();
    this.dimensions = new VicVerticalBarChartDimensionsConfig();
    this.ordinal.valueAccessor = (d, i) => i;
    this.quantitative.valueAccessor = (d) => d;
    this.quantitative.scaleType = scaleLinear;
    this.category.valueAccessor = (d) => d;
    this.category.colors = ['lightslategray'];
    Object.assign(this, init);
  }
}

export class VicBarsLabelsConfig {
  display: boolean;
  offset: number;
  darkLabelColor: string;
  lightLabelColor: string;
  noValueFunction: (d) => string;

  constructor(init?: Partial<VicBarsLabelsConfig>) {
    this.display = true;
    this.offset = 4;
    this.darkLabelColor = 'black';
    this.lightLabelColor = 'white';
    this.noValueFunction = (d) => 'N/A';
    Object.assign(this, init);
  }
}

export class VicBarsDimensionsConfig {
  direction: 'vertical' | 'horizontal';
  x: 'ordinal' | 'quantitative';
  y: 'ordinal' | 'quantitative';
  ordinal: 'x' | 'y';
  quantitative: 'x' | 'y';
  quantitativeDimension: 'width' | 'height';

  constructor(init?: Partial<VicBarsDimensionsConfig>) {
    Object.assign(this, init);
  }
}

export class VicHorizontalBarsDimensionsConfig extends VicBarsDimensionsConfig {
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

export class VicVerticalBarChartDimensionsConfig extends VicBarsDimensionsConfig {
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

export class VicBarsTooltipData {
  datum: any;
  value: string;
}
