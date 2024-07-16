import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { VicSide } from '../../core/types/layout';
import { VicDataValue } from '../../core/types/values';
import { VicXyAxisOptions } from '../xy-axis-options';
import { VicXyAxisConfig } from '../xy-axis.config';

export interface VicYAxisOptions<TickValue extends VicDataValue>
  extends VicXyAxisOptions<TickValue> {
  /**
   * The side of the chart on which the axis will be placed.
   */
  side: VicSide.left | VicSide.right;
}

export function mixinYAxisConfig<
  TickValue extends VicDataValue,
  T extends AbstractConstructor<VicXyAxisConfig<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base implements VicYAxisOptions<TickValue> {
    side: VicSide.left | VicSide.right;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
      this.side = this.side ?? VicSide.left;
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

export class VicYAxisConfig<
  TickValue extends VicDataValue
> extends mixinYAxisConfig(VicXyAxisConfig)<TickValue> {}
