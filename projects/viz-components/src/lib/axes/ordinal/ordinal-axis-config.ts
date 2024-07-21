import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { VicXyAxisOptions } from '../xy-axis-options';
import { VicXyAxisConfig } from '../xy-axis.config';

export type VicOrdinalAxisOptions<TickValue extends DataValue> =
  VicXyAxisOptions<TickValue>;

export function mixinOrdinalAxisConfig<
  TickValue extends DataValue,
  T extends AbstractConstructor<VicXyAxisConfig<TickValue>>
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
> extends mixinOrdinalAxisConfig(VicXyAxisConfig)<TickValue> {}
