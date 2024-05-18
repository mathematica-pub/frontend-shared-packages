import { mixinXAxis } from '../../axes/x/x-axis';
import { VicDataValue } from '../../data-marks/dimensions/data-dimension';
import { XyAxisStub } from './xy-axis.stub';

export class XAxisStub<T extends VicDataValue> extends mixinXAxis(
  XyAxisStub
)<T> {
  setAxis(axisFunction: any): void {
    return;
  }
}
