import { safeAssign } from '@hsi/app-dev-kit';
import { ValueUtilities } from '../../../../../core/utilities/values';
import {
  DomainPadding,
  DomainPaddingType,
  PaddedDomainArguments,
} from '../domain-padding';
import { RoundUpToIntervalDomainPaddingOptions } from './round-to-interval-options';

export class RoundUpToIntervalDomainPadding extends DomainPadding {
  readonly type: DomainPaddingType.roundInterval;
  readonly interval: (maxValue: number) => number;

  constructor(options: RoundUpToIntervalDomainPaddingOptions) {
    super();
    safeAssign(this, options);
    this.type = DomainPaddingType.roundInterval;
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToInterval(
      args.value,
      this.interval(args.value),
      args.valueType
    );
  }
}
