import { ConnectedPosition, OverlaySizeConfig } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { TooltipConfig } from '../tooltip.config';

export class HtmlTooltipConfig extends TooltipConfig {
  override type: 'html';
  position: CdkManagedFromOriginPosition | AbsoluteOffsetFromOriginPosition;
  size: OverlaySizeConfig;
  addEventsDisabledClass: boolean;
  panelClass: string | string[];
  origin?: ElementRef<Element>;
  hasBackdrop: boolean;
  closeOnBackdropClick?: boolean;

  constructor(init?: Partial<HtmlTooltipConfig>) {
    super();
    this.addEventsDisabledClass = true;
    this.size = new HtmlTooltipSize();
    this.hasBackdrop = false;
    this.closeOnBackdropClick = false;
    Object.assign(this, init);
  }
}

export class AbsoluteOffsetFromOriginPosition {
  type: 'global';
  offsetY: number;
  offsetX: number;

  constructor() {
    this.type = 'global';
    this.offsetY = 0;
    this.offsetX = 0;
  }
}

export class CdkManagedFromOriginPosition {
  type: 'connected';
  config: ConnectedPosition;

  constructor() {
    this.type = 'connected';
    this.config = new HtmlTooltipDefaultConnectedPosition();
  }
}

/** Default position for the overlay. Follows the behavior of a tooltip. */
export class HtmlTooltipDefaultConnectedPosition {
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

export class HtmlTooltipSize implements OverlaySizeConfig {}
