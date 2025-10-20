import { safeAssign } from '@hsi/app-dev-kit';
import { TickWrapOptions } from './tick-wrap-options';

/**
 * A config that specifies how axis tick labels should wrap.
 */
export class TickWrap {
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;
  breakOnChars: string[];
  spaceAroundBreakChars: boolean;
  width:
    | 'bandwidth'
    | number
    | ((chartWidth: number, numOfTicks: number) => number);

  constructor(options: TickWrapOptions) {
    safeAssign(this, options);
  }
}
