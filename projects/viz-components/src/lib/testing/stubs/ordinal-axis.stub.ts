import { OrdinalAxisMixin } from '../../axes/ordinal/ordinal-axis';
import { VicDataValue } from '../../core/types/values';
import { XyAxisStub } from './xy-axis.stub';

export class OrdinalAxisStub<T extends VicDataValue> extends OrdinalAxisMixin(
  XyAxisStub
)<T> {
  setScale(): void {
    return;
  }
  setAxisFunction(): void {
    return;
  }
  setTranslate(): void {
    return;
  }
}
