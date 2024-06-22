import {
  curveLinear,
  schemeTableau10,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import {
  VicCategoricalColorDimensionConfig,
  VicDateDimensionConfig,
  VicQuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';

export class VicStackedAreaConfig<Datum> extends VicDataMarksConfig<Datum> {
  x: VicDateDimensionConfig<Datum> = new VicDateDimensionConfig();
  y: VicQuantitativeDimensionConfig<Datum> =
    new VicQuantitativeDimensionConfig();
  category: VicCategoricalColorDimensionConfig<Datum> =
    new VicCategoricalColorDimensionConfig();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueIsDefined?: (...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curve: (x: any) => any;
  stackOffsetFunction: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrderFunction: (x: any) => any;
  categoryOrder?: string[];

  constructor(init?: Partial<VicStackedAreaConfig<Datum>>) {
    super();
    this.category.valueAccessor = () => 1;
    this.category.colors = schemeTableau10 as string[];
    this.curve = curveLinear;
    this.stackOrderFunction = stackOrderNone;
    this.stackOffsetFunction = stackOffsetNone;
    Object.assign(this, init);
  }
}
