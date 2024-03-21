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

export class VicBarsConfig<Datum> extends VicDataMarksConfig<Datum> {
  ordinal: VicOrdinalDimensionConfig<Datum> = new VicOrdinalDimensionConfig();
  quantitative: VicQuantitativeDimensionConfig<Datum> =
    new VicQuantitativeDimensionConfig();
  category: VicCategoricalColorDimensionConfig<Datum> =
    new VicCategoricalColorDimensionConfig();
  dimensions: VicBarsDimensionsConfig;
  labels: VicBarsLabelsConfig<Datum>;
  patternPredicates?: VicPatternPredicate[];

  constructor(init?: Partial<VicBarsConfig<Datum>>) {
    super();
    this.dimensions = new VicVerticalBarsDimensionsConfig();
    this.ordinal.valueAccessor = (d, i) => i;
    this.category.valueAccessor = () => undefined;
    this.quantitative.scaleType = scaleLinear;
    this.category.colors = ['lightslategray'];
    Object.assign(this, init);
  }
}

export class VicBarsLabelsConfig<Datum> {
  display: boolean;
  offset: number;
  color?: string;
  noValueFunction: (d: Datum, ...args: any) => string;

  constructor(init?: Partial<VicBarsLabelsConfig<Datum>>) {
    this.display = true;
    this.offset = 4;
    this.noValueFunction = () => 'N/A';
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

export class VicVerticalBarsDimensionsConfig extends VicBarsDimensionsConfig {
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
