import { XAxisMixin } from '../../axes/x/x-axis';
import { XyAxisStub } from './xy-axis.stub';

export class XAxisStub extends XAxisMixin(XyAxisStub) {
  setAxis(axisFunction: any): void {
    return;
  }
}
