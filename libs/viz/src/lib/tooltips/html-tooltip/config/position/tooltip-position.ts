import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  OverlayPositionBuilder,
} from '@angular/cdk/overlay';

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
    Object.assign(this, config); // Merge any additional overrides
  }
}

export class HtmlTooltipCdkManagedPosition {
  constructor(public positions: ConnectedPosition[]) {}

  getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder
  ): FlexibleConnectedPositionStrategy {
    return overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions(this.positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
