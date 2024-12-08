import { MarksOptions } from '../../../marks';
import { AxisLabelOptions } from '../../axis-label/axis-label-options';
import { TickWrap } from '../../tick-wrap/tick-wrap-config';

export interface XyAxisBaseOptions<TickValue> extends MarksOptions<never> {
  removeDomainLine: boolean;
  removeTickMarks: boolean;
  removeTicks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
  label: AxisLabelOptions;
}
