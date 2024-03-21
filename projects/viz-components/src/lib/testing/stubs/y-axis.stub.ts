import { mixinYAxis } from '../../axes/y/y-axis';
import { XyAxisStub } from './xy-axis.stub';

export class YAxisStub extends mixinYAxis(XyAxisStub) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
}
