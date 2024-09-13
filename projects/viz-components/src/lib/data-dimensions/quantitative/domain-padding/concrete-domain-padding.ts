import { PercentOverDomainPadding } from './percent-over/percent-over';
import { PixelDomainPadding } from './pixel/pixel';
import { RoundUpToIntervalDomainPadding } from './round-to-interval/round-to-interval';
import { RoundUpToSigFigDomainPadding } from './round-to-sig-fig/round-to-sig-fig';

export type ConcreteDomainPadding =
  | RoundUpToSigFigDomainPadding
  | RoundUpToIntervalDomainPadding
  | PercentOverDomainPadding
  | PixelDomainPadding;
