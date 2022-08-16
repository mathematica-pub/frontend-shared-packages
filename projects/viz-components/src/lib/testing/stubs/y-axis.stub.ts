import { YAxisMixin } from '../../axes/y/y-axis';
import { XyAxisStub } from './xy-axis.stub';

export class YAxisStub extends YAxisMixin(XyAxisStub) {
  setAxis(axisFunction: any): void {
    return;
  }
}
