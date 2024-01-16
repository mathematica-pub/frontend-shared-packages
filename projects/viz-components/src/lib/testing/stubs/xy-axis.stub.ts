import { XyAxis } from '../../axes/xy-axis';

export class XyAxisStub extends XyAxis {
  setAxisFunction() {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
