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
  VicCategoricalColorDimensionConfig,
  VicQuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';

export class VicStackedAreaConfig extends VicDataMarksConfig {
  x: VicQuantitativeDimensionConfig = new VicQuantitativeDimensionConfig();
  y: VicQuantitativeDimensionConfig = new VicQuantitativeDimensionConfig();
  category: VicCategoricalColorDimensionConfig =
    new VicCategoricalColorDimensionConfig();
  valueIsDefined?: (...args: any) => any;
  curve: (x: any) => any;
  stackOffsetFunction: (
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  stackOrderFunction: (x: any) => any;
  categoryOrder?: string[];

  constructor(init?: Partial<VicStackedAreaConfig>) {
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
