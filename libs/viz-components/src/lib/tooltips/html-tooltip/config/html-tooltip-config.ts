import { ElementRef } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import { Tooltip } from '../../config/tooltip';
import { HtmlTooltipOptions } from './html-tooltip-options';
import {
  HtmlTooltipCdkManagedPosition,
  HtmlTooltipOffsetFromOriginPosition,
} from './position/tooltip-position';
import { HtmlTooltipSize } from './size/tooltip-size';

export class HtmlTooltipConfig extends Tooltip implements HtmlTooltipOptions {
  override type: 'html';
  applyEventsDisabledClass: boolean;
  hasBackdrop: boolean;
  origin: ElementRef<Element>;
  panelClass: string[];
  position: HtmlTooltipOffsetFromOriginPosition | HtmlTooltipCdkManagedPosition;
  size: HtmlTooltipSize;

  constructor(options: HtmlTooltipOptions) {
    super();
    safeAssign(this, options);
  }
}
