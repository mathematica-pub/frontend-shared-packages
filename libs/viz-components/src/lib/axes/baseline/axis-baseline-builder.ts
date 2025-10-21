import { safeAssign } from '@mathstack/app-kit';
import { AxisBaseline } from './axis-baseline';

const DEFAULT = {
  _zeroBaseline: {
    display: true,
    dasharray: '2, 2',
  },
};

export class AxisBaselineBuilder {
  private _display: boolean;
  private _zeroBaseline: {
    display: boolean;
    dasharray: string;
  };

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Determines whether the axis baseline will be displayed.
   *
   * @param value - `true` to display the axis baseline, `false` to remove the axis baseline.
   *
   * If not called, the default value is `true`.
   */
  display(value: boolean = true): this {
    this._display = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies properties for the axis baseline when there are positive and negative values on the perpendicular axis.
   *
   * @param value - { display: boolean; stroke: StrokeBuilder }
   *
   * If display is `true`, the axis baseline will be relocated to the zero tick mark of the perpendicular axis. This line will still be displayed even if the axis baseline at the edge of the chart is removed.
   *
   * If display is `false`, the axis baseline will be removed.
   *
   * If stroke is `null`, the axis baseline will be displayed as a dashed line.
   */
  zeroBaseline(
    value: Partial<{
      dasharray: string;
      display: boolean;
    }>
  ): this;
  zeroBaseline(value: null): this;
  zeroBaseline(
    value?: Partial<{
      dasharray: string;
      display: boolean;
    }> | null
  ): this {
    this._zeroBaseline = DEFAULT._zeroBaseline;
    if (value === null) {
      return this;
    }
    this._zeroBaseline.display = value.display ?? true;
    this._zeroBaseline.dasharray =
      value.dasharray ?? DEFAULT._zeroBaseline.dasharray;
    return this;
  }

  _build(dimension: 'ordinal' | 'quantitative'): AxisBaseline {
    if (this._display === undefined) {
      this._display = dimension === 'ordinal' ? false : true;
    }
    return new AxisBaseline({
      display: this._display,
      zeroBaseline: this._zeroBaseline,
    });
  }
}
