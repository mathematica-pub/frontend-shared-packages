import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import { XyAxisBaseOptions } from '../base/config/xy-axis-options';
import { Ticks } from '../ticks/ticks';
import { TicksOptions } from '../ticks/ticks-options';

export interface VicOrdinalAxisOptions<Tick extends DataValue>
  extends XyAxisBaseOptions {
  ticks: TicksOptions<Tick>;
}

export function mixinOrdinalAxisConfig<
  Tick extends DataValue,
  T extends AbstractConstructor<XyAxisConfig<Tick, Ticks<Tick>>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base implements VicOrdinalAxisOptions<Tick> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
    }
  }
  return Mixin;
}

export abstract class VicOrdinalAxisConfig<
  Tick extends DataValue,
> extends mixinOrdinalAxisConfig(XyAxisConfig)<Tick, Ticks<Tick>> {}
