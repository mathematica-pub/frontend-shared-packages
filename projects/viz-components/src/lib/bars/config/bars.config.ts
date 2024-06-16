import { min, range } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { VicDimensionOrdinal } from '../../data-dimensions/ordinal/ordinal';
import { VicDimensionQuantitative } from '../../data-dimensions/quantitative/quantitative';
import { VicDataMarksOptions } from '../../data-marks/data-marks.config';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';
import { VicBarsDimensions } from './bars-dimensions';
import { VicBarsLabels } from './bars-labels';

export interface VicBarsOptions<
  Datum,
  TOrdinalValue extends VicDataValue,
  TCategoricalValue extends VicDataValue = string
> extends VicDataMarksOptions<Datum> {
  categorical: VicDimensionCategorical<Datum, TCategoricalValue>;
  ordinal: VicDimensionOrdinal<Datum, TOrdinalValue>;
  quantitative: VicDimensionQuantitative<Datum>;
  labels: VicBarsLabels<Datum>;
}

export class VicBarsConfig<Datum, TOrdinalValue extends VicDataValue>
  extends VicXyDataMarksConfig<Datum>
  implements VicBarsOptions<Datum, TOrdinalValue>
{
  barsKeyFunction: (i: number) => string;
  readonly categorical: VicDimensionCategorical<Datum, string>;
  readonly dimensions: VicBarsDimensions;
  hasNegativeValues: boolean;
  readonly labels: VicBarsLabels<Datum>;
  readonly ordinal: VicDimensionOrdinal<Datum, TOrdinalValue>;
  readonly quantitative: VicDimensionQuantitative<Datum>;

  constructor(
    dimensions: VicBarsDimensions,
    options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
  ) {
    super();
    Object.assign(this, options);
    this.dimensions = dimensions;
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndicies();
    this.setHasNegativeValues();
    this.setBarsKeyFunction();
  }

  protected setDimensionPropertiesFromData(): void {
    this.quantitative.setPropertiesFromData(this.data);
    this.ordinal.setPropertiesFromData(this.data, this.dimensions.isHorizontal);
    this.categorical.setPropertiesFromData(this.data);
  }

  protected setValueIndicies(): void {
    this.valueIndicies = range(this.data.length).filter((i) => {
      if (!this.ordinal.domainIncludes(this.ordinal.values[i])) {
        return false;
      } else {
        const ordinalValue = this.ordinal.values[i];
        const firstIndex = this.ordinal.values.indexOf(ordinalValue);
        return i === firstIndex;
      }
    });
  }

  protected setHasNegativeValues(): void {
    this.hasNegativeValues = min(this.quantitative.values) < 0;
  }

  protected setBarsKeyFunction(): void {
    this.barsKeyFunction = (i: number): string => `${this.ordinal.values[i]}`;
  }
}
