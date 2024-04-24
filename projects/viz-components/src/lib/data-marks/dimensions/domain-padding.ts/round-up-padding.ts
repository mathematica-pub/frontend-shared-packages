import { ValueUtilities } from '../../../shared/value-utilities.class';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

export class VicRoundUpDomainPadding extends VicDomainPadding {
  type: DomainPadding.roundUp = DomainPadding.roundUp;
  sigDigits: (d: any) => number;

  constructor(init?: Partial<VicRoundUpDomainPadding>) {
    super();
    this.sigDigits = () => 1;
    Object.assign(this, init);
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      args.value,
      this.sigDigits(args.value),
      args.valueType
    );
  }
}
