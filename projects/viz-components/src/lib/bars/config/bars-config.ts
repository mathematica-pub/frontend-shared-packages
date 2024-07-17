import { min, range } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { VicDimensionOrdinal } from '../../data-dimensions/ordinal/ordinal';
import { VicDimensionQuantitativeNumeric } from '../../data-dimensions/quantitative/quantitative-numeric';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';
import { VicBarsDimensions } from './bars-dimensions';
import { VicBarsOptions } from './bars-options';
import { VicBarsLabels } from './labels/bars-labels';

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
  readonly quantitative: VicDimensionQuantitativeNumeric<Datum>;

  constructor(
    dimensions: VicBarsDimensions,
    options: VicBarsOptions<Datum, TOrdinalValue>
  ) {
    super();
    Object.assign(this, options);
    this.dimensions = dimensions;
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndices();
    this.setHasNegativeValues();
    this.setBarsKeyFunction();
  }

  protected setDimensionPropertiesFromData(): void {
    this.quantitative.setPropertiesFromData(this.data);
    this.ordinal.setPropertiesFromData(this.data, this.dimensions.isHorizontal);
    this.categorical.setPropertiesFromData(this.data);
  }

  protected setValueIndices(): void {
    this.valueIndices = range(this.data.length).filter((i) => {
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
