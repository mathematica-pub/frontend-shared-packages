import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { VicDataValue } from '../../core/types/values';
import { VicXyAxisConfig, VicXyAxisOptions } from '../xy-axis.config';

const DEFAULT = {
  tickSizeOuter: 0,
};

export interface VicOrdinalAxisOptions<TickValue extends VicDataValue>
  extends VicXyAxisOptions<TickValue> {
  /**
   * A value that is passed to D3's [tickSizeOuter]{@link https://github.com/d3/d3-axis#axis_tickSizeOuter}
   *  method.
   *
   * If not provided, value will be set to 0.
   */
  tickSizeOuter: number;
}

export function mixinOrdinalAxisConfig<
  TickValue extends VicDataValue,
  T extends AbstractConstructor<VicXyAxisConfig<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin
    extends Base
    implements VicOrdinalAxisOptions<TickValue>
  {
    tickSizeOuter: number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
      this.tickSizeOuter = this.tickSizeOuter ?? DEFAULT.tickSizeOuter;
    }
  }
  return Mixin;
}

export class VicOrdinalAxisConfig<
  TickValue extends VicDataValue
> extends mixinOrdinalAxisConfig(VicXyAxisConfig)<TickValue> {}
