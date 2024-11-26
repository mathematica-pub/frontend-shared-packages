import { BinStrategy } from '../attribute-data-bin-enums';
import { CalculatedBinsAttributeDataDimension } from '../calculated-bins/calculated-bins';
import { EqualFrequenciesAttributeDataDimensionOptions } from './equal-frequencies-bins-options';

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal number of observations. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 2] and [4, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class EqualFrequenciesAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string,
  >
  extends CalculatedBinsAttributeDataDimension<Datum, RangeValue>
  implements EqualFrequenciesAttributeDataDimensionOptions<Datum, RangeValue>
{
  override readonly binType: BinStrategy.equalFrequencies;
  private calculatedDomain: number[];
  readonly numBins: number;

  constructor(
    options: EqualFrequenciesAttributeDataDimensionOptions<Datum, RangeValue>
  ) {
    super('number');
    this.binType = BinStrategy.equalFrequencies;
    Object.assign(this, options);
    if (!this.valueAccessor) {
      console.error(
        'Value accessor is required for EqualNumObservationsAttributeDataDimension'
      );
    }
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomain(values);
    this.setNumBins();
    this.setRange();
  }

  protected setDomain(values: number[]): void {
    this.calculatedDomain = values;
  }

  private setNumBins(): void {
    this.calculatedNumBins = this.numBins;
  }

  getScale() {
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
