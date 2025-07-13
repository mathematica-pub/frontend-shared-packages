import { TooltipPosition } from '../../events';
import { TooltipPositionBuilder2 } from '../../events/event-positions-new';
import { HtmlTooltipCdkManagedPosition } from '../../tooltips';

export class DotsTooltipPositioner {
  constructor(private anchor: { x: number; y: number }) {}

  fromAnchor(offset: { x: number; y: number }): HtmlTooltipCdkManagedPosition {
    const positions = [
      new TooltipPositionBuilder2()
        .fromCenter()
        .attachBottomCenter()
        .getPosition(),
      new TooltipPositionBuilder2()
        .fromCenter()
        .attachBottomLeft()
        .getPosition(),
      new TooltipPositionBuilder2()
        .fromCenter()
        .attachBottomRight()
        .getPosition(),
    ];
    const positionsWithOffsets = new TooltipPositionBuilder2().applyOffsets(
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
