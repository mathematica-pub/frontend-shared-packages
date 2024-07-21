/* eslint-disable @typescript-eslint/no-explicit-any */
import { XyAxis } from '../../axes/base/xy-axis-base';
import { yAxisMixin } from '../../axes/y/y-axis';
import { DataValue } from '../../core/types/values';

export class YAxisStub<T extends DataValue> extends yAxisMixin(XyAxis)<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
}
