import { mixinQuantitativeAxis } from '../../axes/quantitative/quantitative-axis';
import { XyAxis } from '../../axes/xy-axis';

export class QuantitativeAxisStub extends mixinQuantitativeAxis(XyAxis) {
  setScale(): void {
    return;
  }
  setAxisFunction() {
    return;
  }
  initNumTicks(): number {
    return 16;
  }
  setTranslate(): void {
    return;
  }
}
