/* eslint-disable @typescript-eslint/no-explicit-any */
import { XyAxisElement } from '../../xy-chart-space/xy-axis.class';

export class XyAxisElementStub extends XyAxisElement {
  setAxisFunction() {
    return;
  }
  initNumTicks(): number {
    return 10;
  }
  subscribeToScale(): void {
    return;
  }
  getAxisFunction(): any {
    return {};
  }
  setTranslate(): void {
    return;
  }
}
