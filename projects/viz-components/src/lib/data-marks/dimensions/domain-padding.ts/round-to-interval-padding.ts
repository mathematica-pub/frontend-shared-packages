import { ValueUtilities } from '../../../shared/value-utilities.class';
import {
  DomainPadding,
  DomainPaddingConfig,
  PaddedDomainArguments,
} from './domain-padding';

export class VicRoundUpToIntervalDomainPaddingConfig extends DomainPaddingConfig {
  type: DomainPadding.roundInterval = DomainPadding.roundInterval;
  interval: (maxValue: number) => number;

  constructor(init?: Partial<VicRoundUpToIntervalDomainPaddingConfig>) {
    super();
    this.interval = () => 1;
    Object.assign(this, init);
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToInterval(
      args.value,
      this.interval(args.value),
      args.valueType
    );
  }
}
