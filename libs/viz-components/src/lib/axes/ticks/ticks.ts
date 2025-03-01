import { TickWrap } from './tick-wrap/tick-wrap';
import { QuantitativeTicksOptions, TicksOptions } from './ticks-options';

export class Ticks<Tick> implements TicksOptions<Tick> {
  fontSize: number;
  format: string | ((value: Tick) => string);
  labelsDisplay: boolean;
  labelsStroke: string;
  labelsStrokeOpacity: number;
  labelsStrokeWidth: number;
  rotate: number;
  size: number;
  sizeOuter: number;
  wrap: TickWrap;

  constructor(options: TicksOptions<Tick>) {
    Object.assign(this, options);
  }
}

export class QuantitativeTicks<Tick> extends Ticks<Tick> {
  count: number;
  spacing: number;
  values: Tick[];

  constructor(options: QuantitativeTicksOptions<Tick>) {
    super(options);
  }
}
