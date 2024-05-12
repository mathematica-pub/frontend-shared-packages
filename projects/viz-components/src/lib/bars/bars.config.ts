import { VicDataMarksConfig } from '../data-marks/data-marks-types';
import { VicCategoricalDimension } from '../data-marks/dimensions/categorical-dimension';
import { VicDataValue } from '../data-marks/dimensions/data-dimension';
import { VicOrdinalDimension } from '../data-marks/dimensions/ordinal-dimension';
import { VicQuantitativeDimension } from '../data-marks/dimensions/quantitative-dimension';

export class VicBarsConfig<Datum, TOrdinalValue extends VicDataValue>
  implements VicDataMarksConfig<Datum>
{
  data: Datum[];
  mixBlendMode: string;
  dimensions: VicBarsDimensionsConfig;
  ordinal: VicOrdinalDimension<Datum, TOrdinalValue>;
  quantitative: VicQuantitativeDimension<Datum>;
  categorical: VicCategoricalDimension<Datum, string>;
  labels: VicBarsLabelsConfig<Datum>;

  constructor(init?: Partial<VicBarsConfig<Datum, TOrdinalValue>>) {
    this.mixBlendMode = 'normal';
    this.dimensions = new VicVerticalBarsDimensionsConfig();
    this.ordinal = new VicOrdinalDimension();
    this.quantitative = new VicQuantitativeDimension();
    this.categorical = new VicCategoricalDimension();
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
