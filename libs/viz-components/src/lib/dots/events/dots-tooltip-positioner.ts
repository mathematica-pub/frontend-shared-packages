import { TooltipPositioner } from '../../events/tooltip-positioner';
import { HtmlTooltipCdkManagedPosition } from '../../tooltips';
import { TooltipPositionBuilder } from '../../tooltips/html-tooltip/config/position/tooltip-position-builder';

const DEFAULT_POSITIONS = [
  new TooltipPositionBuilder().fromCenter().attachBottomCenter().getPosition(),
  new TooltipPositionBuilder().fromCenter().attachBottomLeft().getPosition(),
  new TooltipPositionBuilder().fromCenter().attachBottomRight().getPosition(),
];

export class DotsTooltipPositioner extends TooltipPositioner {
  constructor(private anchor: { x: number; y: number }) {
    super();
  }

  fromAnchor(offset: { x: number; y: number }): HtmlTooltipCdkManagedPosition {
    const positionsWithOffsets = new TooltipPositionBuilder().applyOffsets(
      DEFAULT_POSITIONS,
      this.anchor.x + offset.x,
      this.anchor.y - offset.y
    );
    return new HtmlTooltipCdkManagedPosition(positionsWithOffsets);
  }
}
