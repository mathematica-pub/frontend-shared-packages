import { ValueUtilities } from '../../../../core/utilities/values';
import {
  DomainPadding,
  DomainPaddingType,
  PaddedDomainArguments,
} from '../domain-padding';
import { RoundUpToSigFigDomainPaddingOptions } from './round-to-sig-fig-options';

export class RoundUpToSigFigDomainPadding
  extends DomainPadding
  implements RoundUpToSigFigDomainPaddingOptions
{
  readonly sigFigures: (d: number) => number;
  readonly type: DomainPaddingType.roundUp;

  constructor(options: RoundUpToSigFigDomainPaddingOptions) {
    super();
    Object.assign(this, options);
    this.type = DomainPaddingType.roundUp;
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToNSignificantFigures(
      args.value,
      this.sigFigures(args.value),
      args.valueType
    );
  }
}
