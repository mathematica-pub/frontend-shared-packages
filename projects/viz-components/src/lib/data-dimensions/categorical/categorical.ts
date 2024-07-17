import { InternSet, scaleOrdinal } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicDataDimension } from '../dimension';
import { VicCategoricalDimensionOptions } from './categorical-options';
import { VicFillPattern } from './fill-pattern';

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

  constructor(
    options: VicCategoricalDimensionOptions<Datum, TCategoricalValue>
  ) {
    super();
    Object.assign(this, options);
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
