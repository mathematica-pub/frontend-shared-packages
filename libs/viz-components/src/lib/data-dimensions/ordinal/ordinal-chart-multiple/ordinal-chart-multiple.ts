import { InternSet, range, scaleOrdinal } from 'd3';
import { DataValue } from '../../../core/types/values';
import { DataDimension } from '../../dimension';
import { OrdinalChartMultipleOptions } from './ordinal-chart-multiple-options';

export class OrdinalChartMultipleDimension<
  Datum,
  Domain extends DataValue,
> extends DataDimension<Datum, Domain> {
  private _calculatedDomain: Domain[];
  readonly domain: Domain[];
  private internSetDomain: InternSet<Domain>;
  private scale: (category: Domain) => number;

  constructor(options: OrdinalChartMultipleOptions<Datum, Domain>) {
    super('ordinal');
    Object.assign(this, options);
  }

  get calculatedDomain(): Domain[] {
    return this._calculatedDomain;
  }

  getScale(): (category: Domain) => number {
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

  domainIncludes(value: Domain): boolean {
    return this.internSetDomain.has(value);
  }

  private setScale(): void {
    const domain = [...this.internSetDomain.values()];
    this.scale = scaleOrdinal(domain, range(domain.length));
  }
}
