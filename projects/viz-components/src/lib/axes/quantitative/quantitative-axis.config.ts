import { Directive } from '@angular/core';
import { AxisTimeInterval } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { VicDataValue } from '../../core/types/values';
import { VicXyAxisOptions } from '../xy-axis-options';
import { VicXyAxisConfig } from '../xy-axis.config';

export interface VicQuantitativeAxisOptions<TickValue extends VicDataValue>
  extends VicXyAxisOptions<TickValue> {
  /**
   * A value that will be sent to D3's [ticks]{@link https://github.com/d3/d3-axis#axis_ticks}
   *  method.
   *
   * If ticks are formatted as integers and this value is greater than the domain,
   *  this value will be replaced by the largest number
   *  that fits the domain.
   *
   * If ticks are formatted as percentages and this value is greater than would
   *  fit the domain given the precision of the percentage format, this value
   *  will be replaced by the largest number that fits the domain.
   */
  numTicks: number | AxisTimeInterval;
  /**
   * Used only on quantitative axes.
   *
   * An array of values to use for ticks. If specified, D3 will not generate its own ticks.
   *
   * Serves as a parameter for D3's [tickValues]{@link https://github.com/d3/d3-axis#axis_tickValues}
   *  method.
   *
   * Values will be formatted with either the provided value for
   *  [tickFormat]{@link VicXyAxisConfig.tickFormat} or the default format.
   */
  tickValues: TickValue[];
}

export function mixinQuantitativeAxisConfig<
  TickValue extends VicDataValue,
  T extends AbstractConstructor<VicXyAxisConfig<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin
    extends Base
    implements VicQuantitativeAxisOptions<TickValue>
  {
    numTicks: number | AxisTimeInterval;
    tickValues: TickValue[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
    }
  }
  return Mixin;
}

export class VicQuantitativeAxisConfig<
  TickValue extends VicDataValue
> extends mixinQuantitativeAxisConfig(VicXyAxisConfig)<TickValue> {}
