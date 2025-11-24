import { ElementRef } from '@angular/core';
import { HtmlTooltipCdkManagedPosition } from './position/tooltip-position';
import { HtmlTooltipSize } from './size/tooltip-size';

export interface HtmlTooltipOptions {
  hasBackdrop: boolean;
  origin: ElementRef<Element>;
  panelClass: string | string[];
  position: HtmlTooltipCdkManagedPosition;
  size: HtmlTooltipSize;
  show: boolean;
}
