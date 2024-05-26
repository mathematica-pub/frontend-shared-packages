import { ValueUtilities } from '../../shared/value-utilities.class';
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

/**
 *
 * @param {<VicRoundToIntervalDomainPaddingOptions>} options
 * @param {(d: number) => number} options.interval - A function that returns the interval to round to. An interval of 5 rounds up to the nearest multiple of 5 (5, 10, 15, etc). Defaults to 1.
 * @returns
 */
export function vicRoundUpToIntervalDomainPadding(
  options?: Partial<VicRoundUpToIntervalDomainPaddingOptions>
): VicRoundUpToIntervalDomainPadding {
  return new VicRoundUpToIntervalDomainPadding(options);
}
