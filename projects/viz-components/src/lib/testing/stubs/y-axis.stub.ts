import { XyAxis } from '../../axes/xy-axis';
import { mixinYAxis } from '../../axes/y/y-axis';

export class YAxisStub extends mixinYAxis(XyAxis) {
  setAxis(axisFunction: any): void {
    return;
  }
}
