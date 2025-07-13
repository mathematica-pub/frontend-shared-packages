import { ConnectedPosition } from '@angular/cdk/overlay';
import { TooltipPosition, TooltipPositionConfig } from './tooltip-position';

export class TooltipPositionBuilder {
  private originX?: TooltipPositionConfig['originX'];
  private originY?: TooltipPositionConfig['originY'];
  private overlayX: TooltipPositionConfig['overlayX'] = 'center';
  private overlayY: TooltipPositionConfig['overlayY'] = 'bottom';
  private currentOffsetX = 0;
  private currentOffsetY = 0;
  private additionalConfig: Partial<ConnectedPosition> = {};

  // From methods - set origin
  fromTopLeft(): this {
    this.originX = 'start';
    this.originY = 'top';
    return this;
  }

  fromTopCenter(): this {
    this.originX = 'center';
    this.originY = 'top';
    return this;
  }

  fromTopRight(): this {
    this.originX = 'end';
    this.originY = 'top';
    return this;
  }

  fromCenterLeft(): this {
    this.originX = 'start';
    this.originY = 'center';
    return this;
  }

  fromCenter(): this {
    this.originX = 'center';
    this.originY = 'center';
    return this;
  }

  fromCenterRight(): this {
    this.originX = 'end';
    this.originY = 'center';
    return this;
  }

  fromBottomLeft(): this {
    this.originX = 'start';
    this.originY = 'bottom';
    return this;
  }

  fromBottomCenter(): this {
    this.originX = 'center';
    this.originY = 'bottom';
    return this;
  }

  fromBottomRight(): this {
    this.originX = 'end';
    this.originY = 'bottom';
    return this;
  }

  // Attach methods - set overlay
  attachTopLeft(): this {
    this.overlayX = 'start';
    this.overlayY = 'top';
    return this;
  }

  attachTopCenter(): this {
    this.overlayX = 'center';
    this.overlayY = 'top';
    return this;
  }

  attachTopRight(): this {
    this.overlayX = 'end';
    this.overlayY = 'top';
    return this;
  }

  attachCenterLeft(): this {
    this.overlayX = 'start';
    this.overlayY = 'center';
    return this;
  }

  attachCenter(): this {
    this.overlayX = 'center';
    this.overlayY = 'center';
    return this;
  }

  attachCenterRight(): this {
    this.overlayX = 'end';
    this.overlayY = 'center';
    return this;
  }

  attachBottomLeft(): this {
    this.overlayX = 'start';
    this.overlayY = 'bottom';
    return this;
  }

  attachBottomCenter(): this {
    this.overlayX = 'center';
    this.overlayY = 'bottom';
    return this;
  }

  attachBottomRight(): this {
    this.overlayX = 'end';
    this.overlayY = 'bottom';
    return this;
  }

  // Offset method
  offset(offsetX: number, offsetY: number): this {
    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;
    return this;
  }

  // Additional config
  withConfig(config: Partial<ConnectedPosition>): this {
    this.additionalConfig = { ...this.additionalConfig, ...config };
    return this;
  }

  // Build the position
  getPosition(): TooltipPosition {
    if (!this.originX || !this.originY) {
      throw new Error('Origin position must be set using a from* method');
    }

    return new TooltipPosition({
      originX: this.originX,
      originY: this.originY,
      overlayX: this.overlayX,
      overlayY: this.overlayY,
      offsetX: this.currentOffsetX,
      offsetY: this.currentOffsetY,
      ...this.additionalConfig,
    });
  }

  // Reset builder for reuse
  reset(): this {
    this.originX = undefined;
    this.originY = undefined;
    this.overlayX = 'center';
    this.overlayY = 'bottom';
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
    this.additionalConfig = {};
    return this;
  }

  // Utility method for applying offsets to multiple positions
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
}
