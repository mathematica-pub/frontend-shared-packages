import { VicDataMarksConfig } from '../data-marks/data-marks-types';
import { VicCategoricalDimension } from '../data-marks/dimensions/categorical-dimension';
import { VicDataValue } from '../data-marks/dimensions/data-dimension';
import { VicOrdinalDimension } from '../data-marks/dimensions/ordinal-dimension';
import { VicQuantitativeDimension } from '../data-marks/dimensions/quantitative-dimension';
import {
  VicBarsDimensions,
  VicVerticalBarsDimensions,
} from './bars-dimensions';
import { VicBarsLabels } from './bars-labels';

export class VicBarsConfig<Datum, TOrdinalValue extends VicDataValue>
  implements VicDataMarksConfig<Datum>
{
  data: Datum[];
  mixBlendMode: string;
  dimensions: VicBarsDimensions;
  ordinal: VicOrdinalDimension<Datum, TOrdinalValue>;
  quantitative: VicQuantitativeDimension<Datum>;
  categorical: VicCategoricalDimension<Datum, string>;
  labels: VicBarsLabels<Datum>;

  constructor(init?: Partial<VicBarsConfig<Datum, TOrdinalValue>>) {
    this.mixBlendMode = 'normal';
    this.dimensions = new VicVerticalBarsDimensions();
    this.ordinal = new VicOrdinalDimension();
    this.quantitative = new VicQuantitativeDimension();
    this.categorical = new VicCategoricalDimension();
    Object.assign(this, init);
  }
}
