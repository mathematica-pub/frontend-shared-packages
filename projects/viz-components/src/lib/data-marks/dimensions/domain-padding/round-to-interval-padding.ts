import { ValueUtilities } from '../../../shared/value-utilities.class';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

export class VicRoundUpToIntervalDomainPadding extends VicDomainPadding {
  type: DomainPadding.roundInterval = DomainPadding.roundInterval;
  interval: (maxValue: number) => number;

  constructor(init?: Partial<VicRoundUpToIntervalDomainPadding>) {
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
