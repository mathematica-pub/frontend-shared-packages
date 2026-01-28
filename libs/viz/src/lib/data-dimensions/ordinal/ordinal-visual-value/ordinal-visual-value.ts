import { safeAssign } from '@mathstack/app-kit';
import { InternSet, scaleOrdinal } from 'd3';
import { DataValue, VisualValue } from '../../../core/types/values';
import { DataDimension } from '../../dimension';
import { OrdinalVisualValueDimensionOptions } from './ordinal-visual-value-options';

/**
 * A dimension that transforms string / number / Date values into a value of type number or string.
 *
 * This dimension is intended to be used to set a visual property of an element in a chart.
 *
 * The first generic is the type of the data that will be passed to the dimension. The second generic is the type of the value that will be used to set the visual property. The third generic is the type of the range of the scale / the output value.
 *
 * TESTABLE FUNCTIONALITY
 *
 * - It extracts values for the dimension from data.
 *   - tested in: ordinal-visual-value.cy.ts
 * - It sets the domain of the dimension.
 *   - tested in: ordinal-visual-value.cy.ts
 * - It checks if a value is in the domain.
 * - The domain can be set by the user passing in an array of values.
 *   - tested in: ordinal-chart-position.spec.ts
 * - The domain will be unique values from the data if no custom domain is given by the user.
 *   - tested in: ordinal-chart-position.spec.ts
 * - The domain will always contain only unique values.
 *   - tested in: ordinal-chart-position.spec.ts
 */

export class OrdinalVisualValueDimension<
  Datum,
  Domain extends DataValue,
  Range extends VisualValue,
> extends DataDimension<Datum, Domain> {
  private _calculatedDomain: Domain[];
  private readonly domain: Domain[];
  private internSetDomain: InternSet<Domain>;
  readonly range: Range[];
  private scale: (category: Domain) => Range;

  constructor(
    options: OrdinalVisualValueDimensionOptions<Datum, Domain, Range>
  ) {
    super('ordinal');
    safeAssign(this, options);
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
