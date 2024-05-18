import { XyAxis } from '../../axes/xy-axis';
import { mixinYAxis } from '../../axes/y/y-axis';
import { VicDataValue } from '../../data-marks/dimensions/data-dimension';

export class YAxisStub<T extends VicDataValue> extends mixinYAxis(XyAxis)<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
}
