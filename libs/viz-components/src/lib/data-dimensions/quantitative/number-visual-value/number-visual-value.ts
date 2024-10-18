import { ScaleContinuousNumeric } from 'd3';
import { VisualValue } from '../../../core';
import { NumberDimension } from '../number-dimension/number-dimension';
import { NumberVisualValueDimensionOptions } from './number-visual-value-options';

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
    super();
    Object.assign(this, options);
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
