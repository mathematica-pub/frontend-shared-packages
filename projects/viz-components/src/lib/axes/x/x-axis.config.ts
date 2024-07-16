import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { VicSide } from '../../core/types/layout';
import { VicDataValue } from '../../core/types/values';
import { VicXyAxisOptions } from '../xy-axis-options';
import { VicXyAxisConfig } from '../xy-axis.config';

export interface VicXAxisOptions<TickValue extends VicDataValue>
  extends VicXyAxisOptions<TickValue> {
  /**
   * The side of the chart on which the axis will be placed.
   */
  side: VicSide.top | VicSide.bottom;
}

export function mixinXAxisConfig<
  TickValue extends VicDataValue,
  T extends AbstractConstructor<VicXyAxisConfig<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    side: VicSide.top | VicSide.bottom;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
      this.side = this.side ?? VicSide.bottom;
    }

    getSuggestedNumTicksFromChartDimension(dimensions: {
      height: number;
      width: number;
    }): number {
      const d3SuggestedDefault = dimensions.width / 40;
      return this.getValidatedNumTicks(d3SuggestedDefault);
    }
  }
  return Mixin;
}

export class VicXAxisConfig<
  TickValue extends VicDataValue
> extends mixinXAxisConfig(VicXyAxisConfig)<TickValue> {}
