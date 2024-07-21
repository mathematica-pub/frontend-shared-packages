import { Directive } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { VicXyAxisOptions } from '../xy-axis-options';
import { VicXyAxisConfig } from '../xy-axis.config';

export interface VicXAxisOptions<TickValue extends DataValue>
  extends VicXyAxisOptions<TickValue> {
  /**
   * The side of the chart on which the axis will be placed.
   */
  side: 'top' | 'bottom';
}

export function mixinXAxisConfig<
  TickValue extends DataValue,
  T extends AbstractConstructor<VicXyAxisConfig<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    side: 'top' | 'bottom';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, args[0]);
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
  TickValue extends DataValue
> extends mixinXAxisConfig(VicXyAxisConfig)<TickValue> {}
