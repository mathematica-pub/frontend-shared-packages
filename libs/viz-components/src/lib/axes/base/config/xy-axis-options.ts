import { TickWrap } from '../../tick-wrap/tick-wrap-config';

export interface XyAxisBaseOptions<TickValue> {
  removeDomainLine: boolean;
  removeTickMarks: boolean;
  removeTicks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
}
