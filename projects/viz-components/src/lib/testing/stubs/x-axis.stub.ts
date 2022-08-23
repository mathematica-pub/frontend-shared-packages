import { mixinXAxis } from '../../axes/x/x-axis';
import { XyAxisStub } from './xy-axis.stub';

export class XAxisStub extends mixinXAxis(XyAxisStub) {
  setAxis(axisFunction: any): void {
    return;
  }
}
