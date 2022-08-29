import {
  curveLinear,
  scaleLinear,
  scaleUtc,
  schemeTableau10,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import {
  CategoricalColorDimensionConfig,
  QuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import { DataMarksConfig } from '../data-marks/data-marks.config';

export class StackedAreaConfig extends DataMarksConfig {
  x: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
  y: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
  category: CategoricalColorDimensionConfig =
    new CategoricalColorDimensionConfig();
  valueIsDefined?: (...args: any) => any;
  curve: (x: any) => any;
  stackOffsetFunction: (
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  stackOrderFunction: (x: any) => any;
  categoryOrder?: string[];

  constructor(init?: Partial<StackedAreaConfig>) {
    super();
    this.x.valueAccessor = ([x]) => x;
    this.x.scaleType = scaleUtc;
    this.y.valueAccessor = ([, y]) => y;
    this.y.scaleType = scaleLinear;
    this.category.valueAccessor = () => 1;
    this.category.colors = schemeTableau10 as string[];
    this.curve = curveLinear;
    this.stackOrderFunction = stackOrderNone;
    this.stackOffsetFunction = stackOffsetNone;
    Object.assign(this, init);
  }
}
