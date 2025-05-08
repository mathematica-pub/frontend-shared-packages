import { Directive } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import { DataValue } from '../../core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import { XyAxisBaseOptions } from '../base/config/xy-axis-options';
import { Ticks } from '../ticks/ticks';

export interface XAxisOptions extends XyAxisBaseOptions {
  /**
   * The side of the chart on which the axis will be placed.
   */
  side: 'top' | 'bottom';
}

export function mixinXAxisConfig<
  Tick extends DataValue,
  TicksConfig extends Ticks<Tick>,
  T extends AbstractConstructor<XyAxisConfig<Tick, TicksConfig>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    side: 'top' | 'bottom';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      if (args.length > 0) {
        safeAssign(this, args[0]);
      }
    }

    getNumTicksBySpacing(
      spacing: number,
      dimensions: {
        height: number;
        width: number;
      }
    ): number {
      const d3SuggestedDefault = dimensions.width / spacing;
      return this.getValidatedNumTicks(d3SuggestedDefault);
    }
  }
  return Mixin;
}

export class XAxisConfig<
  Tick extends DataValue,
  TicksConfig extends Ticks<Tick>,
> extends mixinXAxisConfig(XyAxisConfig)<Tick, TicksConfig> {}
