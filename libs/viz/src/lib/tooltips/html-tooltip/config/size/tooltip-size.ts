import { safeAssign } from '@mathstack/app-kit';
import { HtmlTooltipSizeOptions } from './tooltip-size-options';

export class HtmlTooltipSize implements HtmlTooltipSizeOptions {
  width: number | string;
  height: number | string;
  minWidth: number | string;
  minHeight: number | string;
  maxWidth: number | string;
  maxHeight: number | string;

  constructor(options: HtmlTooltipSizeOptions) {
    safeAssign(this, options);
  }
}
