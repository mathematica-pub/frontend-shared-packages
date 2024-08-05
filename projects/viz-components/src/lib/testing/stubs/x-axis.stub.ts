/* eslint-disable @typescript-eslint/no-explicit-any */
import { xAxisMixin } from '../../axes/x/x-axis';
import { DataValue } from '../../core/types/values';
import { XyAxisStub } from './xy-axis.stub';

export class XAxisStub<T extends DataValue> extends xAxisMixin(XyAxisStub)<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
}
