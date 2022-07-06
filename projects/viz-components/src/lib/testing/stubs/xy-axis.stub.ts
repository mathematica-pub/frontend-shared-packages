import { XyAxis } from '../../axes/xy-axis';

export class XyAxisStub extends XyAxis {
  setAxisFunction() {
    return;
  }
  setAxis(axisFunction: any): void {
    return;
  }
  initNumTicks(): number {
    return 10;
  }
  setScale(): void {
    return;
  }
  getAxisFunction(): any {
    return {};
  }
  setTranslate(): void {
    return;
  }
}
