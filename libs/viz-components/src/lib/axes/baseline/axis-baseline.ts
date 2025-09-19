import { safeAssign } from '@hsi/app-dev-kit';
import { AxisBaselineOptions } from './axis-baseline-options';

export class AxisBaseline implements AxisBaselineOptions {
  readonly display: boolean;
  readonly zeroBaseline: { display: boolean; dasharray: string };

  constructor(options: AxisBaselineOptions) {
    safeAssign(this, options);
  }
}
