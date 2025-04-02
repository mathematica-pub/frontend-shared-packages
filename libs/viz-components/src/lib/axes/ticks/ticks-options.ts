import { AxisTimeInterval } from 'd3';
import { TickWrap } from './tick-wrap/tick-wrap';

export interface TicksOptions<Tick> {
  fontSize: number;
  format: string | ((value: Tick) => string);
  labelsDisplay: boolean;
  labelsStroke: string;
  labelsStrokeOpacity: number;
  labelsStrokeWidth: number;
  rotate: number;
  size: number;
  sizeInner: number;
  sizeOuter: number;
  wrap: TickWrap;
}

export interface QuantitativeTicksOptions<Tick> extends TicksOptions<Tick> {
  count: number | AxisTimeInterval;
  spacing: number;
  values: Tick[];
}
