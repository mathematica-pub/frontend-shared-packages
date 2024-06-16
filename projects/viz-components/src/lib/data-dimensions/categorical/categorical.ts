import { InternSet, scaleOrdinal, schemeTableau10 } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicDataDimension, VicDataDimensionOptions } from '../dimension';
import { VicFillPattern } from './fill-pattern';

const DEFAULT = {
  range: schemeTableau10 as string[],
  valueAccessor: () => '',
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
   * User must also provide their own implementation of `valueAccessor`.
   * If a custom valueAccessor function is not provided, this function will not be used (due to default value of `valueAccessor`).
   */
  scale: (category: TCategoricalValue) => string;
  valueFormat: never;
}

export class VicDimensionCategorical<
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
    Object.assign(this, DEFAULT, options);
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
