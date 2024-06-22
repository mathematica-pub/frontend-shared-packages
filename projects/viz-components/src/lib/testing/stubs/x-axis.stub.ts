/* eslint-disable @typescript-eslint/no-explicit-any */
import { mixinXAxis } from '../../axes/x/x-axis';
import { XyAxisStub } from './xy-axis.stub';

export class XAxisStub extends mixinXAxis(XyAxisStub) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
}
