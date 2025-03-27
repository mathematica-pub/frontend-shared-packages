/* eslint-disable @typescript-eslint/no-explicit-any */
import { XyAxis } from '../../axes/base/xy-axis-base';
import { Ticks } from '../../axes/ticks/ticks';
import { yAxisMixin } from '../../axes/y/y-axis';
import { DataValue } from '../../core/types/values';

export class YAxisStub<
  T extends DataValue,
  TicksConfig extends Ticks<T>,
> extends yAxisMixin(XyAxis)<T, TicksConfig> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
}
