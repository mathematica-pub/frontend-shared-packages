import { OrdinalAxisMixin } from '../../axes/ordinal/ordinal-axis';
import { XyAxisStub } from './xy-axis.stub';

export class OrdinalAxisStub extends OrdinalAxisMixin(XyAxisStub) {
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
