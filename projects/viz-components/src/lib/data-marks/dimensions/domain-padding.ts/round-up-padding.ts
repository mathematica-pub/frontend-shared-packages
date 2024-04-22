import { ValueUtilities } from '../../../shared/value-utilities.class';
import {
  DomainPadding,
  DomainPaddingConfig,
  PaddedDomainArguments,
} from './domain-padding';

export class VicRoundUpDomainPaddingConfig extends DomainPaddingConfig {
  type: DomainPadding.roundUp = DomainPadding.roundUp;
  sigDigits: (d: any) => number;

  constructor(init?: Partial<VicRoundUpDomainPaddingConfig>) {
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
