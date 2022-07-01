import { mixinOrdinalAxis } from '../../axes/ordinal/ordinal-axis';
import { XyAxis } from '../../axes/xy-axis';

export class OrdinalAxisStub extends mixinOrdinalAxis(XyAxis) {
  setScale(): void {
    return;
  }
  setAxisFunction(): void {
    return;
  }
  initNumTicks(): number {
    return 16;
  }
  setTranslate(): void {
    return;
  }
}
