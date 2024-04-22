import {
  curveLinear,
  schemeTableau10,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import { VicDataValue } from '../../public-api';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';
import { VicCategoricalDimensionConfig } from '../data-marks/dimensions/categorical-dimension';
import { VicDateDimensionConfig } from '../data-marks/dimensions/date-dimension';
import { VicQuantitativeDimensionConfig } from '../data-marks/dimensions/quantitative-dimension';

export class VicStackedAreaConfig<Datum> extends VicDataMarksConfig<Datum> {
  x: VicDateDimensionConfig<Datum> = new VicDateDimensionConfig();
  y: VicQuantitativeDimensionConfig<Datum> =
    new VicQuantitativeDimensionConfig();
  category: VicCategoricalDimensionConfig<Datum, string> =
    new VicCategoricalDimensionConfig();
  valueIsDefined?: (...args: any) => boolean;
  curve: (x: any) => any;
  stackOffsetFunction: (
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  stackOrderFunction: (x: any) => any;
  categoryOrder?: VicDataValue[];

  constructor(init?: Partial<VicStackedAreaConfig<Datum>>) {
    super();
    this.category.valueAccessor = () => '1';
    this.category.range = schemeTableau10 as string[];
    this.curve = curveLinear;
    this.stackOrderFunction = stackOrderNone;
    this.stackOffsetFunction = stackOffsetNone;
    Object.assign(this, init);
  }
}
