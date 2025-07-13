import { HtmlTooltipCdkManagedPosition, TooltipPosition } from '../../tooltips';
import { TooltipPositionBuilder } from '../../tooltips/html-tooltip/config/position/tooltip-position-builder';

export class BarsTooltipPositioner {
  constructor(private anchor: { x: number; y: number }) {}

  fromAnchor(offset: { x: number; y: number }): HtmlTooltipCdkManagedPosition {
    const positions = [
      new TooltipPositionBuilder()
        .fromTopLeft()
        .attachBottomCenter()
        .getPosition(),
      new TooltipPositionBuilder()
        .fromTopLeft()
        .attachBottomLeft()
        .getPosition(),
      new TooltipPositionBuilder()
        .fromTopLeft()
        .attachBottomRight()
        .getPosition(),
    ];
    const positionsWithOffsets = new TooltipPositionBuilder().applyOffsets(
      positions,
      this.anchor.x + offset.x,
      this.anchor.y - offset.y
    );
    return new HtmlTooltipCdkManagedPosition(positionsWithOffsets);
  }

  customPosition(positions: TooltipPosition[]): HtmlTooltipCdkManagedPosition {
    return new HtmlTooltipCdkManagedPosition(positions);
  }
}
