/* eslint-disable @typescript-eslint/no-explicit-any */
import { XyAxis } from '../../axes/xy-axis';
import { mixinYAxis } from '../../axes/y/y-axis';
import { VicDataValue } from '../../core/types/values';

export class YAxisStub<T extends VicDataValue> extends mixinYAxis(XyAxis)<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
}
