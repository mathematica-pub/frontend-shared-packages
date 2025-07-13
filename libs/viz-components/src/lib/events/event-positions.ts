import { ConnectedPosition } from '@angular/cdk/overlay';

type TooltipPositionConfig = {
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

export class TooltipPositionBuilder {
  private defaultOverlayX: TooltipPositionConfig['overlayX'] = 'center';
  private defaultOverlayY: TooltipPositionConfig['overlayY'] = 'bottom';

  // Set default overlay positioning
  withDefaultOverlay(
    overlayX: TooltipPositionConfig['overlayX'],
    overlayY: TooltipPositionConfig['overlayY']
  ) {
    this.defaultOverlayX = overlayX;
    this.defaultOverlayY = overlayY;
    return this;
  }

  // Create a position with origin coordinates
  position(
    originX: TooltipPositionConfig['originX'],
    originY: TooltipPositionConfig['originY'],
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    additionalConfig?: Partial<ConnectedPosition>
  ): TooltipPosition {
    return new TooltipPosition({
      originX,
      originY,
      overlayX: overlayOverrides?.overlayX ?? this.defaultOverlayX,
      overlayY: overlayOverrides?.overlayY ?? this.defaultOverlayY,
      ...additionalConfig,
    });
  }

  applyOffsets(
    positions: TooltipPosition[],
    offsetX: number,
    offsetY: number
  ): TooltipPosition[] {
    return positions.map(
      (pos) =>
        new TooltipPosition({
          ...pos,
          offsetX: (pos.offsetX || 0) + offsetX,
          offsetY: (pos.offsetY || 0) + offsetY,
        })
    );
  }

  // Convenience methods for common origin positions
  fromTopLeft(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('start', 'top', overlayOverrides, config);
  }

  fromTopCenter(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('center', 'top', overlayOverrides, config);
  }

  fromTopRight(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('end', 'top', overlayOverrides, config);
  }

  fromCenterLeft(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('start', 'center', overlayOverrides, config);
  }

  fromCenter(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('center', 'center', overlayOverrides, config);
  }

  fromCenterRight(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('end', 'center', overlayOverrides, config);
  }

  fromBottomLeft(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('start', 'bottom', overlayOverrides, config);
  }

  fromBottomCenter(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('center', 'bottom', overlayOverrides, config);
  }

  fromBottomRight(
    overlayOverrides?: Partial<
      Pick<TooltipPositionConfig, 'overlayX' | 'overlayY'>
    >,
    config?: Partial<ConnectedPosition>
  ) {
    return this.position('end', 'bottom', overlayOverrides, config);
  }
}
