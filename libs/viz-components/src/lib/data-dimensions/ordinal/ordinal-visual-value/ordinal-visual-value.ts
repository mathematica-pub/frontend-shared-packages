import { InternSet, scaleOrdinal } from 'd3';
import { DataValue, VisualValue } from '../../../core/types/values';
import { FillDef } from '../../../fill-defs/fill-def';
import { DataDimension } from '../../dimension';
import { OrdinalVisualValueDimensionOptions } from './ordinal-visual-value-options';

export class OrdinalVisualValueDimension<
  Datum,
  Domain extends DataValue,
  Range extends VisualValue,
> extends DataDimension<Datum, Domain> {
  private _calculatedDomain: Domain[];
  private readonly domain: Domain[];
  readonly fillDefs: FillDef<Datum>[];
  private internSetDomain: InternSet<Domain>;
  readonly range: Range[];
  scale: (category: Domain) => Range;

  constructor(
    options: OrdinalVisualValueDimensionOptions<Datum, Domain, Range>
  ) {
    super();
    Object.assign(this, options);
  }

  get calculatedDomain(): Domain[] {
    return this._calculatedDomain;
  }

  getScale(): (category: Domain) => Range {
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

  domainIncludes(value: Domain): boolean {
    return this.internSetDomain.has(value);
  }
}
