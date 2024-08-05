import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseConfig } from '../base/config/xy-axis-config';
import { XyAxisBaseOptions } from '../base/config/xy-axis-options';

export interface YAxisOptions<TickValue extends DataValue>
  extends XyAxisBaseOptions<TickValue> {
  /**
   * The side of the chart on which the axis will be placed.
   */
  side: 'left' | 'right';
}

export function mixinYAxisConfig<
  TickValue extends DataValue,
  T extends AbstractConstructor<XyAxisBaseConfig<TickValue>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base implements YAxisOptions<TickValue> {
    side: 'left' | 'right';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
      this.side = this.side ?? 'left';
    }

    getSuggestedNumTicksFromChartDimension(dimensions: {
      height: number;
      width: number;
    }): number {
      const d3SuggestedDefault = dimensions.height / 50;
      return this.getValidatedNumTicks(d3SuggestedDefault);
    }
  }
  return Mixin;
}

export class YAxisConfig<TickValue extends DataValue> extends mixinYAxisConfig(
  XyAxisBaseConfig
)<TickValue> {}
