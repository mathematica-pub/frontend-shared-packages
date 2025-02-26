import { MarksOptions } from '../../../marks';
import { AxisLabelOptions } from '../../axis-label/axis-label-options';
import { Grid } from '../../grid/grid-config';
import { TickWrap } from '../../tick-wrap/tick-wrap';

export interface XyAxisBaseOptions<TickValue> extends MarksOptions {
  grid: Grid;
  label: AxisLabelOptions;
  marksClass: string;
  removeDomainLine: boolean;
  removeTickLabels: boolean;
  removeTickMarks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
}
