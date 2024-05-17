import { ValueUtilities } from '../../../shared/value-utilities.class';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

const DEFAULT = {
  interval: () => 1,
};

export interface VicRoundUpToIntervalDomainPaddingOptions {
  interval: (maxValue: number) => number;
}

export class VicRoundUpToIntervalDomainPadding extends VicDomainPadding {
  readonly type: DomainPadding.roundInterval;
  readonly interval: (maxValue: number) => number;

  constructor(options?: Partial<VicRoundUpToIntervalDomainPaddingOptions>) {
    super();
    Object.assign(this, options);
    this.type = DomainPadding.roundInterval;
    this.interval = this.interval ?? DEFAULT.interval;
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToInterval(
      args.value,
      this.interval(args.value),
      args.valueType
    );
  }
}

export function vicRoundUpToIntervalDomainPadding(
  options?: Partial<VicRoundUpToIntervalDomainPaddingOptions>
): VicRoundUpToIntervalDomainPadding {
  return new VicRoundUpToIntervalDomainPadding(options);
}
