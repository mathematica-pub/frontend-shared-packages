import {
  ConnectedPosition,
  OverlayConfig,
  OverlaySizeConfig,
} from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { TooltipConfig } from '../tooltip.config';

export class HtmlTooltipConfig extends TooltipConfig {
  override type: 'html';
  position: ConnectedPosition;
  size: OverlaySizeConfig;
  disableEventsOnTooltip: boolean;
  panelClass: string | string[];
  origin?: ElementRef;

  constructor(init?: Partial<HtmlTooltipConfig>) {
    super();
    this.disableEventsOnTooltip = true;
    this.position = new HtmlTooltipDefaultPosition();
    this.size = new HtmlTooltipSize();
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
  panelClass: string | string[];

  constructor(init?: Partial<ConnectedPosition>) {
    this.originX = 'start';
    this.originY = 'top';
    this.overlayX = 'center';
    this.overlayY = 'bottom';
    Object.assign(this, init);
  }
}
export class HtmlTooltipOverlayConfig extends OverlayConfig {
  override positionStrategy: never;
}

export class HtmlTooltipSize implements OverlaySizeConfig {}
