import { InternSet, scaleOrdinal, schemeTableau10 } from 'd3';
import { VicDataValue } from '../core/types/values';
import { VicDataDimension, VicDataDimensionOptions } from './data-dimension';
import { VicFillPattern } from './fill-pattern';

const DEFAULT = {
  range: schemeTableau10 as string[],
  valueAccessor: (d, i) => i,
};

export interface VicCategoricalDimensionOptions<
  Datum,
  TCategoricalValue extends VicDataValue = string
> extends VicDataDimensionOptions<Datum, TCategoricalValue> {
  domain: TCategoricalValue[];
  fillPatterns: VicFillPattern<Datum>[];
  /**
   * An array of visual values that will be the output from D3 scale ordinal.
   *
   * For example, this could be an array of colors or sizes.
   *
   * Default is D3's schemeTableau10.
   *
   * To have all items have the same visual value, use an array with a single element.
   *
   * Will not be used if `scale` is provided.
   */
  range: string[];
  /**
   * A user-defined function that transforms a categorical value into a graphical value.
   */
  scale: (category: TCategoricalValue) => string;
  valueFormat: never;
}

export class VicCategoricalDimension<
  Datum,
  TCategoricalValue extends VicDataValue = string
> extends VicDataDimension<Datum, TCategoricalValue> {
  private _calculatedDomain: TCategoricalValue[];
  private readonly domain: TCategoricalValue[];
  readonly fillPatterns: VicFillPattern<Datum>[];
  private internSetDomain: InternSet<TCategoricalValue>;
  readonly range: string[];
  private scale: (category: TCategoricalValue) => string;
  readonly valueAccessor: (d: Datum) => TCategoricalValue;

  constructor(
    options?: Partial<VicCategoricalDimensionOptions<Datum, TCategoricalValue>>
  ) {
    super();
    Object.assign(this, options);
    this.valueAccessor = this.valueAccessor ?? (() => '' as TCategoricalValue);
    this.range = this.range ?? DEFAULT.range;
  }

  get calculatedDomain(): TCategoricalValue[] {
    return this._calculatedDomain;
  }

  getScale(): (category: TCategoricalValue) => string {
    return this.scale;
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
    this.setScale();
  }

  protected setDomain(): void {
    let domain = this.domain;
    if (domain === undefined) {
      domain = this.values;
    }
    this.internSetDomain = new InternSet(domain);
    this._calculatedDomain = [...this.internSetDomain.values()];
  }

  private setScale(): void {
    if (this.scale === undefined) {
      this.scale = scaleOrdinal([...this.internSetDomain.values()], this.range);
    }
  }

  domainIncludes(value: TCategoricalValue): boolean {
    return this.internSetDomain.has(value);
  }
}

/**
 * @param {Partial<VicCategoricalDimensionOptions<Datum, TCategoricalValue extends VicDataValue>>} options - **REQUIRED**
 * @param {(d: Datum, ...args: any) => string} options.valueAccessor - (d: Datum, ...args: any) => TCategoricalValue - **REQUIRED**
 * @param {TCategoricalValue[]} options.domain - TCategoricalValue[] - An array of values that is used as the domain of the dimension's scale. If not provided by the user, unique values from the data are used to set the scale domain.
 * @param {VicFillPattern<Datum>[]} options.fillPatterns - VicFillPattern<Datum>[] - An array of fill patterns specifications to be used for the dimension's values. Default is undefined.
 * @param {string[]} options.range - string[] - An array of graphical values that correspond to the domain. Default is D3's schemeTableau10.
 * @param {(category: TCategoricalValue) => string} options.scale - (category: TCategoricalValue) => string - A user-defined function that transforms a categorical value into a graphical value.
 */
export function vicCategoricalDimension<
  Datum,
  TCategoricalValue extends VicDataValue = string
>(
  options?: Partial<VicCategoricalDimensionOptions<Datum, TCategoricalValue>>
): VicCategoricalDimension<Datum, TCategoricalValue> {
  return new VicCategoricalDimension(options);
}
