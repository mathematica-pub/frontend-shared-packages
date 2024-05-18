import { extent, interpolateLab, scaleQuantize } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import {
  CalculatedRangeBinsAttributeDataDimension,
  VicCalculatedRangeBinsAttributeDataDimensionOptions,
} from './calculated-bins';

const DEFAULT = {
  interpolator: interpolateLab,
  numBins: 3,
  scale: scaleQuantize,
  range: ['white', 'pink', 'red'],
};

export interface VicEqualValuesAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends VicCalculatedRangeBinsAttributeDataDimensionOptions<
    Datum,
    number,
    RangeValue
  > {
  domain: [number, number];
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal value ranges. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 49] and [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualValuesAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string
  >
  extends CalculatedRangeBinsAttributeDataDimension<Datum, number, RangeValue>
  implements
    VicCalculatedRangeBinsAttributeDataDimensionOptions<
      Datum,
      number,
      RangeValue
    >
{
  readonly binType: VicValuesBin.equalValueRanges;
  domain: [number, number];

  constructor(
    options?: Partial<
      VicEqualValuesAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ) {
    super();
    this.binType = VicValuesBin.equalValueRanges;
    this.scale = DEFAULT.scale;
    this.interpolator = DEFAULT.interpolator;
    this.numBins = DEFAULT.numBins;
    this.range = DEFAULT.range as RangeValue[];
    Object.assign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomainAndBins(values);
    this.setRange();
  }

  protected setDomainAndBins(values: number[]): void {
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

export function vicEqualValuesAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
>(
  options?: Partial<
    VicEqualValuesAttributeDataDimensionOptions<Datum, RangeValue>
  >
): VicEqualValuesAttributeDataDimension<Datum, RangeValue> {
  return new VicEqualValuesAttributeDataDimension<Datum, RangeValue>(options);
}
