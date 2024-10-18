import { InternSet, scaleOrdinal } from 'd3';
import { DataValue } from '../../core/types/values';
import { FillDef } from '../../fill-defs/fill-def';
import { DataDimension } from '../dimension';
import { CategoricalDimensionOptions } from './categorical-options';

export type VicCategoricalScale<Domain, Range = string> = (
  category: Domain
) => Range;

export class CategoricalDimension<
  Datum,
  TCategoricalValue extends DataValue = string,
> extends DataDimension<Datum, TCategoricalValue> {
  private _calculatedDomain: TCategoricalValue[];
  private readonly domain: TCategoricalValue[];
  readonly fillDefs: FillDef<Datum>[];
  private internSetDomain: InternSet<TCategoricalValue>;
  readonly range: string[];
  private scale: VicCategoricalScale<TCategoricalValue>;

  constructor(options: CategoricalDimensionOptions<Datum, TCategoricalValue>) {
    super();
    Object.assign(this, options);
  }

  get calculatedDomain(): TCategoricalValue[] {
    return this._calculatedDomain;
  }

  getScale(): VicCategoricalScale<TCategoricalValue> {
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
