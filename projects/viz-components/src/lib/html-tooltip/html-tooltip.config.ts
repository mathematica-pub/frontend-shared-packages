import { ConnectedPosition, ScrollStrategy } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';

export class HtmlTooltipConfig {
  show: boolean;
  position: ConnectedPosition;
  disableEventsOnTooltip: boolean;
  scrollStrategy?: ScrollStrategy;
  origin?: ElementRef;

  constructor(init?: Partial<HtmlTooltipConfig>) {
    this.disableEventsOnTooltip = true;
    this.position = new HtmlTooltipDefaultPosition();
    Object.assign(this, init);
  }
}

/** Default position for the overlay. Follows the behavior of a tooltip. */
export class HtmlTooltipDefaultPosition {
  originX: 'start' | 'center' | 'end';
  originY: 'top' | 'center' | 'bottom';
  overlayX: 'start' | 'center' | 'end';
  overlayY: 'top' | 'center' | 'bottom';
  weight?: number;
  offsetX?: number;
  offsetY?: number;
  panelClass?: string | string[];

  constructor(init?: Partial<ConnectedPosition>) {
    this.originX = 'start';
    this.originY = 'top';
    this.overlayX = 'center';
    this.overlayY = 'bottom';
    Object.assign(this, init);
  }
}
