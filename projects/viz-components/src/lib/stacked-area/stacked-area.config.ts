import {
  curveLinear,
  schemeTableau10,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import { VicDataMarksConfig } from '../data-marks/data-marks-types';
import { VicCategoricalDimension } from '../data-marks/dimensions/categorical-dimension';
import { VicDataValue } from '../data-marks/dimensions/data-dimension';
import { VicDateDimension } from '../data-marks/dimensions/date-dimension';
import { VicQuantitativeDimension } from '../data-marks/dimensions/quantitative-dimension';

export class VicStackedAreaConfig<Datum, TCategoricalValue extends VicDataValue>
  implements VicDataMarksConfig<Datum>
{
  data: Datum[];
  mixBlendMode: string;
  x: VicDateDimension<Datum>;
  y: VicQuantitativeDimension<Datum>;
  category: VicCategoricalDimension<Datum, TCategoricalValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueIsDefined?: (d: Datum, i: number, ...args: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curve: (x: any) => any;
  stackOffsetFunction: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrderFunction: (x: any) => any;
  categoryOrder?: TCategoricalValue[];

  constructor(init?: Partial<VicStackedAreaConfig<Datum, TCategoricalValue>>) {
    this.mixBlendMode = 'normal';
    this.x = new VicDateDimension();
    this.y = new VicQuantitativeDimension();
    this.category = new VicCategoricalDimension({
      range: schemeTableau10 as string[],
    });
    this.curve = curveLinear;
    this.stackOrderFunction = stackOrderNone;
    this.stackOffsetFunction = stackOffsetNone;
    Object.assign(this, init);
  }
}
