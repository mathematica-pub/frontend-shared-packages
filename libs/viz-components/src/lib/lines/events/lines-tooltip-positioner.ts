import { HtmlTooltipCdkManagedPosition } from '../../tooltips';
import { TooltipPositionBuilder } from '../../tooltips/html-tooltip/config/position/tooltip-position-builder';
import { TooltipPositioner } from '../../tooltips/html-tooltip/config/position/tooltip-positioner';

const DEFAULT_POSITIONS = [
  new TooltipPositionBuilder().fromTopLeft().attachBottomCenter().getPosition(),
  new TooltipPositionBuilder().fromTopLeft().attachBottomLeft().getPosition(),
  new TooltipPositionBuilder().fromTopLeft().attachBottomRight().getPosition(),
];

export class LinesTooltipPositioner extends TooltipPositioner {
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
