import { mixinYAxis } from '../../axes/y/y-axis';
import { XyAxisStub } from './xy-axis.stub';

export class YAxisStub extends mixinYAxis(XyAxisStub) {
  setAxis(axisFunction: any): void {
    return;
  }
}
