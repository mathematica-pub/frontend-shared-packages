import { VicAuxMarksBuilder } from '../../../marks';
import { AxisBaselineBuilder } from '../../baseline/axis-baseline-builder';
import { GridBuilder } from '../../grid/grid-builder';
import { AxisLabelBuilder } from '../../label/axis-label-builder';

export abstract class XyAxisBaseBuilder extends VicAuxMarksBuilder<void> {
  protected _axis: 'x' | 'y';
  protected _dimension: 'ordinal' | 'quantitative';
  protected baselineBuilder: AxisBaselineBuilder = new AxisBaselineBuilder();
  protected gridBuilder: GridBuilder;
  protected labelBuilder: AxisLabelBuilder;
  protected marksClass: string;

  /**
   * OPTIONAL. Specifies the configuration for the axis baseline. The baseline is the line that typically runs along the edge of the chart, from which tick marks and labels are drawn.
   *
   * @param baseline - A function that specifies properties for the axis baseline, or `null` to unset the baseline.
   *
   * If called with null, the default values of the baseline will be used.
   */
  baseline(baseline: (baseline: AxisBaselineBuilder) => void): this;
  baseline(baseline: null): this;
  baseline(baseline: (baseline: AxisBaselineBuilder) => void): this {
    this.baselineBuilder = new AxisBaselineBuilder();
    if (baseline === null) {
      return this;
    }
    baseline?.(this.baselineBuilder);
    return this;
  }

  /**
   * OPTIONAL. Specifies the configuration of grid lines for the axis. Grid lines are the lines that run perpendicular to the axis and intersect with tick marks.
   *
   * @param grid - A function that specifies properties for the grid lines, or `null` to unset the grid.
   *
   * If called with no argument, the default values of the grid will be used.
   */
  grid(grid: (grid: GridBuilder) => void): this;
  grid(): this;
  grid(grid: null): this;
  grid(grid?: ((grid: GridBuilder) => void) | null): this {
    if (grid === null) {
      this.gridBuilder = undefined;
      return this;
    }
    this.gridBuilder = new GridBuilder();
    grid?.(this.gridBuilder);
    return this;
  }

  /**
   * OPTIONAL. Specifies properties for an axis label.
   *
   * @param label - A function that specifies properties for an axis label, or `null` to unset the label.
   */
  label(label: (label: AxisLabelBuilder) => void): this;
  label(label: null): this;
  label(label: ((label: AxisLabelBuilder) => void) | null): this {
    if (label === null) {
      this.labelBuilder = undefined;
      return this;
    }
    this.labelBuilder = new AxisLabelBuilder();
    label(this.labelBuilder);
    return this;
  }
}
