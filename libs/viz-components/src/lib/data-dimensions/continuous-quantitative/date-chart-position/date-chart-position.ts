import { safeAssign } from '@mathstack/app-kit';
import { ScaleTime, max, min } from 'd3';
import { isDate } from '../../../core/utilities/type-guards';
import { DataDimension } from '../../dimension';
import { DateChartPositionDimensionOptions } from './date-chart-position-options';

/**
 * A dimension that transforms Date values into a position on a chart.
 *
 * This dimension is used for the positional dimensions of a chart, such as x and y. The underlying scale will always be a [D3 time scale](https://d3js.org/d3-scale/time). The range of the scale will be a dimension from the chart.
 *
 * The generic is the type of the data that will be passed to the dimension.
 *
 * TESTABLE FUNCTIONALITY
 *
 * - It extracts values for the dimension from data.
 *   - tested in: lines.cy.ts
 * - It sets the domain of the dimension.
 *   - tested in: lines.cy.ts
 * - It creates and returns a scale from a range.
 *   - tested in: lines.cy.ts
 * - It checks if a value is in valid.
 *   - tested in: lines.cy.ts
 * - The domain will be unique values from the user-provided domain if the user provides a domain.
 *   - tested in: date-chart-position.spec.ts
 * - The domain will be unique values from the data if no custom domain is given by the user.
 *   - tested in: date-chart-position.spec.ts
 * - The domain can be set in reverse order.
 *   - tested in: date-chart-position.spec.ts
 */

export class DateChartPositionDimension<Datum>
  extends DataDimension<Datum, Date>
  implements DateChartPositionDimensionOptions<Datum> {
  private calculatedDomain: [Date, Date];
  readonly domain: [Date, Date];
  readonly formatSpecifier: string;
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor(options: DateChartPositionDimensionOptions<Datum>) {
    super('date');
    safeAssign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
  }

  protected setDomain() {
    const extents: [Date, Date] =
      this.domain === undefined
        ? [min(this.values), max(this.values)]
        : this.domain;
    this.calculatedDomain = extents;
  }

  getScaleFromRange(range: [number, number]): ScaleTime<number, number> {
    return this.scaleFn().domain(this.calculatedDomain).range(range);
  }

  // returns false if data is undefined or null of not a Date
  // for some charts this may be fine
  // original intended use case: d3Line can only handle defined values
  isValidValue(x: unknown): boolean {
    return isDate(x);
  }
}
