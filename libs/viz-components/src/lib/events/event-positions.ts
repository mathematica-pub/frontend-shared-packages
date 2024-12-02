import { ConnectedPosition } from '@angular/cdk/overlay';

export class RelativeToCenterLeftTooltipPosition implements ConnectedPosition {
  originX: 'start' | 'end' | 'center';
  originY: 'center' | 'bottom' | 'top';
  overlayX: 'start' | 'end' | 'center';
  overlayY: 'center' | 'bottom' | 'top';
  weight?: number;
  offsetX?: number;
  offsetY?: number;
  panelClass?: string | string[];

  constructor(private position?: Partial<ConnectedPosition>) {
    this.originX = 'start';
    this.originY = 'center';
    this.overlayX = 'center';
    this.overlayY = 'bottom';

    if (position) {
      Object.assign(this, position);
    }
  }
}

export class RelativeToTopLeftTooltipPosition implements ConnectedPosition {
  originX: 'start' | 'end' | 'center';
  originY: 'center' | 'bottom' | 'top';
  overlayX: 'start' | 'end' | 'center';
  overlayY: 'center' | 'bottom' | 'top';
  weight?: number;
  offsetX?: number;
  offsetY?: number;
  panelClass?: string | string[];

  constructor(private position?: Partial<ConnectedPosition>) {
    this.originX = 'start';
    this.originY = 'top';
    this.overlayX = 'center';
    this.overlayY = 'bottom';

    if (position) {
      Object.assign(this, position);
    }
  }
}

export class RelativeToCenterTooltipPosition implements ConnectedPosition {
  originX: 'start' | 'end' | 'center';
  originY: 'center' | 'bottom' | 'top';
  overlayX: 'start' | 'end' | 'center';
  overlayY: 'center' | 'bottom' | 'top';
  weight?: number;
  offsetX?: number;
  offsetY?: number;
  panelClass?: string | string[];

  constructor(private position?: Partial<ConnectedPosition>) {
    this.originX = 'center';
    this.originY = 'center';
    this.overlayX = 'center';
    this.overlayY = 'bottom';

    if (position) {
      Object.assign(this, position);
    }
  }
}
