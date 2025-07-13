import {
  ConnectedPosition,
  OverlayPositionBuilder,
  PositionStrategy,
} from '@angular/cdk/overlay';

export const DEFAULT_TOOLTIP_Y_OFFSET = 2;

export type TooltipPositionConfig = {
  originX: 'start' | 'center' | 'end';
  originY: 'top' | 'center' | 'bottom';
  overlayX: 'start' | 'center' | 'end';
  overlayY: 'top' | 'center' | 'bottom';
};

export class TooltipPosition implements ConnectedPosition {
  originX: TooltipPositionConfig['originX'];
  originY: TooltipPositionConfig['originY'];
  overlayX: TooltipPositionConfig['overlayX'];
  overlayY: TooltipPositionConfig['overlayY'];
  weight?: number;
  offsetX?: number;
  offsetY?: number;
  panelClass?: string | string[];

  constructor(config: TooltipPositionConfig & Partial<ConnectedPosition>) {
    this.originX = config.originX;
    this.originY = config.originY;
    this.overlayX = config.overlayX;
    this.overlayY = config.overlayY;
    Object.assign(this, config); // Merge any additional overrides
  }
}

export abstract class HtmlTooltipPosition {
  type: 'connected' | 'global';

  abstract getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder,
    document?: Document
  ): PositionStrategy;
}

export class HtmlTooltipCdkManagedPosition extends HtmlTooltipPosition {
  positions: ConnectedPosition[];

  constructor(positions: ConnectedPosition[]) {
    super();
    this.type = 'connected';
    this.positions = positions;
  }

  getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder
  ): PositionStrategy {
    return overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions(this.positions);
  }
}
