import { MarksOptions } from '../../../marks';
import { AxisBaselineOptions } from '../../baseline/axis-baseline-options';
import { Grid } from '../../grid/grid-config';
import { AxisLabelOptions } from '../../label/axis-label-options';

export interface XyAxisBaseOptions extends MarksOptions {
  baseline: AxisBaselineOptions;
  grid: Grid;
  label: AxisLabelOptions;
  marksClass: string;
}
