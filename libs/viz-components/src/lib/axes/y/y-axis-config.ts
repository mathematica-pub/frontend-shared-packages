import { Directive } from '@angular/core';
import { DataValue } from '../../core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import { XyAxisBaseOptions } from '../base/config/xy-axis-options';
import { Ticks } from '../ticks/ticks';

export interface YAxisOptions extends XyAxisBaseOptions {
  /**
   * The side of the chart on which the axis will be placed.
   */
  side: 'left' | 'right';
}

export function mixinYAxisConfig<
  Tick extends DataValue,
  TicksConfig extends Ticks<Tick>,
  T extends AbstractConstructor<XyAxisConfig<Tick, TicksConfig>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base implements YAxisOptions {
    side: 'left' | 'right';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
      this.side = this.side ?? 'left';
    }

    getNumTicksBySpacing(
      spacing: number,
      dimensions: {
        height: number;
        width: number;
      }
    ): number {
      const d3SuggestedDefault = dimensions.height / spacing;
      return this.getValidatedNumTicks(d3SuggestedDefault);
    }
  }
  return Mixin;
}

export class YAxisConfig<
  Tick extends DataValue,
  TicksConfig extends Ticks<Tick>,
> extends mixinYAxisConfig(XyAxisConfig)<Tick, TicksConfig> {}
