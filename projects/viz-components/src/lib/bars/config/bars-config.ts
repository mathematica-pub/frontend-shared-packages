import { min, range } from 'd3';
import { DataValue } from '../../core/types/values';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { OrdinalDimension } from '../../data-dimensions/ordinal/ordinal';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { XyPrimaryMarksConfig } from '../../xy-marks/xy-primary-marks/xy-primary-marks-config';
import { BarsDimensions } from './bars-dimensions';
import { BarsOptions } from './bars-options';
import { BarsLabels } from './labels/bars-labels';

export class BarsConfig<Datum, TOrdinalValue extends DataValue>
  extends XyPrimaryMarksConfig<Datum>
  implements BarsOptions<Datum, TOrdinalValue>
{
  barsKeyFunction: (i: number) => string;
  readonly categorical: CategoricalDimension<Datum, string>;
  readonly dimensions: BarsDimensions;
  hasNegativeValues: boolean;
  readonly labels: BarsLabels<Datum>;
  readonly ordinal: OrdinalDimension<Datum, TOrdinalValue>;
  readonly quantitative: QuantitativeNumericDimension<Datum>;

  constructor(
    dimensions: BarsDimensions,
    options: BarsOptions<Datum, TOrdinalValue>
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
