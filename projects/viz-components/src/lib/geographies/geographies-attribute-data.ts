import {
  extent,
  interpolateLab,
  range,
  scaleLinear,
  scaleOrdinal,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
} from 'd3';
import { VicDataDimensionConfig } from '../data-marks/data-dimension.config';
import { VicPatternPredicate } from '../data-marks/data-marks.config';
import { formatValue } from '../value-format/value-format';

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The generic parameter is the type of the attribute data.
 */
abstract class AttributeDataDimensionConfig<
  Datum
> extends VicDataDimensionConfig<Datum> {
  geoAccessor: (d: Datum, ...args: any) => any;
  range: any[];
  colorScale: (...args: any) => any;
  colors?: string[];
  interpolator: (...args: any) => any;
  patternPredicates?: VicPatternPredicate<Datum>[];

  abstract setDomainAndBins(values: any[]): void;
  abstract setRange(): void;
  abstract getColorScale(nullColor: string): any;

  shouldCalculateBinColors(numBins: number, colors: string[]): boolean {
    return numBins > 1 && colors.length !== numBins;
  }

  getColorGenerator(binIndicies: number[]): any {
    return scaleLinear<string>()
      .domain(extent(binIndicies))
      .range(this.colors)
      .interpolate(this.interpolator);
  }
}

/**
 * Enum that defines the types of binning that can be used to map quantitative attribute data to colors.
 */
export enum VicValuesBin {
  none = 'none',
  categorical = 'categorical',
  equalValueRanges = 'equalValueRanges',
  equalNumObservations = 'equalNumObservations',
  customBreaks = 'customBreaks',
}

export type VicAttributeDataDimensionConfig<Datum> =
  | VicCategoricalAttributeDataDimensionConfig<Datum>
  | VicNoBinsAttributeDataDimensionConfig<Datum>
  | VicEqualValuesAttributeDataDimensionConfig<Datum>
  | VicEqualNumbersAttributeDataDimensionConfig<Datum>
  | VicCustomBreaksAttributeDataDimensionConfig<Datum>;

/**
 * Configuration object for attribute data that is categorical.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCategoricalAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.categorical = VicValuesBin.categorical;
  override interpolator: never;
  override domain: string[];

  constructor(
    init?: Partial<VicCategoricalAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleOrdinal;
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }

  setDomainAndBins(values: any[]): void {
    const domainValues = this.domain ?? values;
    this.domain = [...new Set(domainValues)];
  }

  setRange(): void {
    this.range = this.colors.slice(0, this.domain.length);
  }

  getColorScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor)
      .interpolate(this.interpolator);
  }
}

/**
 * Configuration object for attribute data that is quantitative.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicNoBinsAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.none = VicValuesBin.none;

  constructor(init?: Partial<VicNoBinsAttributeDataDimensionConfig<Datum>>) {
    super();
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }

  setDomainAndBins(values: any[]): void {
    const domainValues = this.domain ?? values;
    this.domain = extent(domainValues);
  }

  setRange(): void {
    this.range = this.colors;
  }

  getColorScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal value ranges. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 49] and [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualValuesAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.equalValueRanges = VicValuesBin.equalValueRanges;
  numBins: number;

  constructor(
    init?: Partial<VicEqualValuesAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }

  setDomainAndBins(values: any[]): void {
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

  valueFormatIsInteger(): boolean {
    return (
      this.valueFormat &&
      typeof this.valueFormat === 'string' &&
      this.valueFormat.includes('0f')
    );
  }

  getValidatedNumBinsAndDomainForIntegerValues(
    numBins: number,
    domain: [number, number]
  ): {
    numBins: number;
    domain: number[];
  } {
    const validated = { numBins, domain };
    const dataRange = [domain[0], domain[domain.length - 1]].map(
      (x) => +formatValue(x, this.valueFormat)
    );
    const numDiscreteValues = Math.abs(dataRange[1] - dataRange[0]) + 1;
    if (numDiscreteValues < numBins) {
      validated.numBins = numDiscreteValues;
      validated.domain = [dataRange[0], dataRange[1] + 1];
    }
    return validated;
  }

  setRange(): void {
    if (this.shouldCalculateBinColors(this.numBins, this.colors)) {
      const binIndicies = range(this.numBins);
      this.range = binIndicies.map((i) =>
        this.getColorGenerator(binIndicies)(i)
      );
    } else {
      this.range = this.colors;
    }
  }

  getColorScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor)
      .interpolate(this.interpolator);
  }
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal number of observations. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 2] and [4, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualNumbersAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.equalNumObservations =
    VicValuesBin.equalNumObservations;
  numBins: number;

  constructor(
    init?: Partial<VicEqualNumbersAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }

  setDomainAndBins(values: any[]): void {
    this.domain = values;
  }

  setRange(): void {
    if (this.shouldCalculateBinColors(this.numBins, this.colors)) {
      const binIndicies = range(this.numBins);
      this.range = binIndicies.map((i) =>
        this.getColorGenerator(binIndicies)(i)
      );
    } else {
      this.range = this.colors;
    }
  }

  getColorScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor)
      .interpolate(this.interpolator);
  }
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into custom breaks. For example, if the data is [0, 1, 2, 4, 60, 100] and breakValues is [0, 2, 5, 10, 50], the bin ranges will be [0, 2], [2, 5], [5, 10], [10, 50], [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */

export class VicCustomBreaksAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.customBreaks = VicValuesBin.customBreaks;
  breakValues: number[];
  numBins: number;

  constructor(
    init?: Partial<VicCustomBreaksAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
    this.numBins = undefined;
  }

  setDomainAndBins(): void {
    this.domain = this.breakValues.slice(1);
    this.numBins = this.breakValues.length - 1;
  }

  setRange(): void {
    this.range = this.colors;
  }

  getColorScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor)
      .interpolate(this.interpolator);
  }
}
