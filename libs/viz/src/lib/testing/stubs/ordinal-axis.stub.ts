import { ordinalAxisMixin } from '../../axes/ordinal/ordinal-axis';
import { Ticks } from '../../axes/ticks/ticks';
import { DataValue } from '../../core/types/values';
import { XyAxisStub } from './xy-axis.stub';

export class OrdinalAxisStub<T extends DataValue> extends ordinalAxisMixin(
  XyAxisStub
)<T, Ticks<T>> {
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
