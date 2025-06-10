import { Directive } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ContinuousValue } from '../../core/types/values';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import { XyAxisBaseOptions } from '../base/config/xy-axis-options';
import { QuantitativeTicks } from '../ticks/ticks';
import { QuantitativeTicksOptions } from '../ticks/ticks-options';

export interface VicQuantitativeAxisOptions<Tick extends ContinuousValue>
  extends XyAxisBaseOptions {
  ticks: QuantitativeTicksOptions<Tick>;
}

export function mixinQuantitativeAxisConfig<
  Tick extends ContinuousValue,
  T extends AbstractConstructor<XyAxisConfig<Tick, QuantitativeTicks<Tick>>>,
>(Base: T) {
  @Directive()
  abstract class Mixin
    extends Base
    implements VicQuantitativeAxisOptions<Tick>
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      if (args.length > 0) {
        safeAssign(this, args[0]);
      }
    }
  }
  return Mixin;
}

export abstract class VicQuantitativeAxisConfig<
  Tick extends ContinuousValue,
> extends mixinQuantitativeAxisConfig(XyAxisConfig)<
  Tick,
  QuantitativeTicks<Tick>
> {}
