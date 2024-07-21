import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxisConfig } from '../config/xy-axis-config';
import { XyAxisOptions } from '../config/xy-axis-options';

export type VicOrdinalAxisOptions<TickValue extends DataValue> =
  XyAxisOptions<TickValue>;

export function mixinOrdinalAxisConfig<
  TickValue extends DataValue,
  T extends AbstractConstructor<XyAxisConfig<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin
    extends Base
    implements VicOrdinalAxisOptions<TickValue>
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
    }
  }
  return Mixin;
}

export class VicOrdinalAxisConfig<
  TickValue extends DataValue
> extends mixinOrdinalAxisConfig(XyAxisConfig)<TickValue> {}
