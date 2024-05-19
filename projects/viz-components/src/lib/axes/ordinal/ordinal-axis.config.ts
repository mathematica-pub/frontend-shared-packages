import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { VicDataValue } from '../../core/types/values';
import { VicXyAxisConfig, VicXyAxisOptions } from '../xy-axis.config';

export type VicOrdinalAxisOptions<TickValue extends VicDataValue> =
  VicXyAxisOptions<TickValue>;

export function mixinOrdinalAxisConfig<
  TickValue extends VicDataValue,
  T extends AbstractConstructor<VicXyAxisConfig<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin
    extends Base
    implements VicOrdinalAxisOptions<TickValue>
  {
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
    }
  }
  return Mixin;
}

export class VicOrdinalAxisConfig<
  TickValue extends VicDataValue
> extends mixinOrdinalAxisConfig(VicXyAxisConfig)<TickValue> {}
