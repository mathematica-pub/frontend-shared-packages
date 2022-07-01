import { mixinXAxis } from '../../axes/x/x-axis';
import { XyAxis } from '../../axes/xy-axis';

export class XAxisStub extends mixinXAxis(XyAxis) {
  setAxis(axisFunction: any): void {
    return;
  }
}
