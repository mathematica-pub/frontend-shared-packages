import { mixinQuantitativeAxis } from '../../axes/quantitative/quantitative-axis';
import { VicDataValue } from '../../data-marks/dimensions/data-dimension';
import { XyAxisStub } from './xy-axis.stub';

export class QuantitativeAxisStub<
  T extends VicDataValue
> extends mixinQuantitativeAxis(XyAxisStub)<T> {
  setScale(): void {
    return;
  }
  setAxisFunction() {
    return;
  }
  setTranslate(): void {
    return;
  }
}
