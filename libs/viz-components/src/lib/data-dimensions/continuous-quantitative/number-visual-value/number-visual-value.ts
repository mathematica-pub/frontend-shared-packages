import { safeAssign } from '@hsi/app-dev-kit';
import { ScaleContinuousNumeric } from 'd3';
import { VisualValue } from '../../../core';
import { NumberDimension } from '../number-dimension/number-dimension';
import { NumberVisualValueDimensionOptions } from './number-visual-value-options';

/**
 * A dimension that transforms number values into a value of type number or string.
 *
 * This dimension is intended to be used to set a visual property of an element in a chart.
 *
 * The first generic is the type of the data that will be passed to the dimension. The second generic is the type of the range of the scale / the output value.
 *
 * TESTABLE FUNCTIONALITY
 *
 * - It extracts values for the dimension from data.
 *   - tested in: dots.cy.ts
 * - It sets the domain of the dimension.
 *   - tested in: dots.cy.ts
 * - It set the scale from the calculated domain and the user-provided range of the user does not provide a scale.
 *   - tested in: dots.cy.ts
 */

export class NumberVisualValueDimension<
  Datum,
  Range extends VisualValue,
> extends NumberDimension<Datum> {
  readonly range: [Range, Range];
  private scale: (value: number) => Range;
  readonly scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<Range>
  ) => ScaleContinuousNumeric<Range, Range>;

  constructor(options: NumberVisualValueDimensionOptions<Datum, Range>) {
    super('number');
    safeAssign(this, options);
  }

  getScale(): (value: number) => Range {
    return this.scale;
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
    this.setScale();
  }

  private setScale(): void {
    if (this.scale === undefined) {
      this.scale = this.scaleFn()
        .domain(this.calculatedDomain)
        .range(this.range);
    }
  }
}
