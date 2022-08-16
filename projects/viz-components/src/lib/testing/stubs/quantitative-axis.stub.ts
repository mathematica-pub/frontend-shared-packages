import { QuantitativeAxisMixin } from '../../axes/quantitative/quantitative-axis';
import { XyAxisStub } from './xy-axis.stub';

export class QuantitativeAxisStub extends QuantitativeAxisMixin(XyAxisStub) {
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
