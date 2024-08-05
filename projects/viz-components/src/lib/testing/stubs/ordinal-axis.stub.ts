import { ordinalAxisMixin } from '../../axes/ordinal/ordinal-axis';
import { DataValue } from '../../core/types/values';
import { XyAxisStub } from './xy-axis.stub';

export class OrdinalAxisStub<T extends DataValue> extends ordinalAxisMixin(
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
