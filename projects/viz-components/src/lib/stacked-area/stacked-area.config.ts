import {
  curveLinear,
  schemeTableau10,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import { VicDataValue } from '../../public-api';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';
import { VicCategoricalDimension } from '../data-marks/dimensions/categorical-dimension';
import { VicDateDimension } from '../data-marks/dimensions/date-dimension';
import { VicQuantitativeDimension } from '../data-marks/dimensions/quantitative-dimension';

export class VicStackedAreaConfig<
  Datum,
  TCategoricalValue extends VicDataValue
> extends VicDataMarksConfig<Datum> {
  x: VicDateDimension<Datum> = new VicDateDimension();
  y: VicQuantitativeDimension<Datum> = new VicQuantitativeDimension();
  category: VicCategoricalDimension<Datum, TCategoricalValue> =
    new VicCategoricalDimension();
  valueIsDefined?: (...args: any) => boolean;
  curve: (x: any) => any;
  stackOffsetFunction: (
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  stackOrderFunction: (x: any) => any;
  categoryOrder?: VicDataValue[];

  constructor(init?: Partial<VicStackedAreaConfig<Datum, TCategoricalValue>>) {
    super();
    this.category.range = schemeTableau10 as string[];
    this.curve = curveLinear;
    this.stackOrderFunction = stackOrderNone;
    this.stackOffsetFunction = stackOffsetNone;
    Object.assign(this, init);
  }
}
