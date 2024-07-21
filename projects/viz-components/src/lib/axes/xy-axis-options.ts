import { TickWrap } from './tick-wrap/tick-wrap-config';

export interface VicXyAxisOptions<TickValue> {
  removeDomain: boolean;
  removeTickMarks: boolean;
  removeTicks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
}
