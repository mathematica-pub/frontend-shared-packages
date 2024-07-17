import { ValueUtilities } from 'projects/viz-components/src/lib/core/utilities/values';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from '../domain-padding';
import { VicRoundUpToIntervalDomainPaddingOptions } from './round-to-interval-options';

export class VicRoundUpToIntervalDomainPadding extends VicDomainPadding {
  readonly type: DomainPadding.roundInterval;
  readonly interval: (maxValue: number) => number;

  constructor(options?: Partial<VicRoundUpToIntervalDomainPaddingOptions>) {
    super();
    Object.assign(this, options);
    this.type = DomainPadding.roundInterval;
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToInterval(
      args.value,
      this.interval(args.value),
      args.valueType
    );
  }
}
