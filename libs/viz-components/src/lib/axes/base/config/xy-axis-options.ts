import { MarksOptions } from '../../../marks';
import { AxisLabelOptions } from '../../axis-label/axis-label-options';
import { GridLines } from '../../grid-lines/grid-lines-config';
import { TickWrap } from '../../tick-wrap/tick-wrap';

export interface XyAxisBaseOptions<TickValue> extends MarksOptions<never> {
  removeDomainLine: boolean;
  removeTickLabels: boolean;
  removeTickMarks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
  gridLines: GridLines;
  label: AxisLabelOptions;
}
