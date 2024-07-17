import { ValueUtilities } from '../../../../core/utilities/values';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from '../domain-padding';
import { VicRoundUpDomainPaddingOptions } from './round-up-options';

export class VicRoundUpDomainPadding
  extends VicDomainPadding
  implements VicRoundUpDomainPaddingOptions
{
  readonly sigDigits: (d: number) => number;
  readonly type: DomainPadding.roundUp;

  constructor(options?: Partial<VicRoundUpDomainPaddingOptions>) {
    super();
    Object.assign(this, options);
    this.type = DomainPadding.roundUp;
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      args.value,
      this.sigDigits(args.value),
      args.valueType
    );
  }
}
