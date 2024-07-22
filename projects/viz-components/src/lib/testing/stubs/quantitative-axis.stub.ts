import { quantitativeAxisMixin } from '../../axes/quantitative/quantitative-axis';
import { DataValue } from '../../core/types/values';
import { XyAxisStub } from './xy-axis.stub';

export class QuantitativeAxisStub<
  T extends DataValue
> extends quantitativeAxisMixin(XyAxisStub)<T> {
  setScale(): void {
    return;
  }
  setAxisFunction() {
    return;
  }
  setTranslate(): void {
    return;
  }
}
