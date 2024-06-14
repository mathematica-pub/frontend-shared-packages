import { ValueUtilities } from '../../shared/value-utilities';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

const DEFAULT = {
  sigDigits: () => 1,
};

export interface VicRoundUpDomainPaddingOptions {
  sigDigits: (d: number) => number;
}

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
    this.sigDigits = this.sigDigits ?? DEFAULT.sigDigits;
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      args.value,
      this.sigDigits(args.value),
      args.valueType
    );
  }
}

// /**
//  *
//  * @param {<VicRoundUpDomainPaddingOptions>} options
//  * @param {(d: number) => number} options.sigDigits - A function that returns the number of significant digits to round to. Defaults to 1.
//  * @returns
//  */
