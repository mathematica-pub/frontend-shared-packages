/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, of } from 'rxjs';
import { XyAxis, XyAxisScale } from '../../axes/xy-axis';
import { VicDataValue } from '../../core/types/values';

export class XyAxisStub<T extends VicDataValue> extends XyAxis<T> {
  getScale(): Observable<XyAxisScale> {
    return of({ scale: 'scale', useTransition: false } as any);
  }
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
  getAxisFunction(): any {
    return {};
  }
  setTranslate(): void {
    return;
  }
}
