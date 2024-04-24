import { extent, interpolateLab, scaleQuantize } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import { CalculatedRangeBinsAttributeDataDimension } from './calculated-bins';

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal value ranges. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 49] and [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualValuesAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedRangeBinsAttributeDataDimension<Datum, number, RangeValue> {
  domain: [number, number];
  binType: VicValuesBin.equalValueRanges = VicValuesBin.equalValueRanges;

  constructor(init?: Partial<VicEqualValuesAttributeDataDimension<Datum>>) {
    super();
    this.scale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }

  setPropertiesFromData(values: any[]): void {
    this.setDomainAndBins(values);
    this.setRange();
  }

  protected setDomainAndBins(values: any[]): void {
    const domainValues = this.domain ?? values;
    this.domain = extent(domainValues);
    if (this.valueFormatIsInteger()) {
      const validated = this.getValidatedNumBinsAndDomainForIntegerValues(
        this.numBins,
        this.domain
      );
      this.numBins = validated.numBins;
      this.domain = validated.domain;
    }
  }

  protected valueFormatIsInteger(): boolean {
    return (
      this.valueFormat &&
      typeof this.valueFormat === 'string' &&
      this.valueFormat.includes('0f')
    );
  }

  protected getValidatedNumBinsAndDomainForIntegerValues(
    numBins: number,
    domain: [number, number]
  ): {
    numBins: number;
    domain: [number, number];
  } {
    const validated = { numBins, domain };
    const dataRange = domain.map((x) => Math.round(x));
    const numDiscreteValues = Math.abs(dataRange[1] - dataRange[0]) + 1;
    if (numDiscreteValues < numBins) {
      validated.numBins = numDiscreteValues;
      validated.domain = [dataRange[0], dataRange[1] + 1];
    }
    return validated;
  }

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}
