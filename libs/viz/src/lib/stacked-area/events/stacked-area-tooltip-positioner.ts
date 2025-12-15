import { TooltipPositioner } from '../../events/tooltip-positioner';
import { HtmlTooltipCdkManagedPosition } from '../../tooltips';
import { TooltipPositionBuilder } from '../../tooltips/html-tooltip/config/position/tooltip-position-builder';

const DEFAULT_POSITIONS = [
  new TooltipPositionBuilder().fromTopLeft().attachBottomCenter().getPosition(),
  new TooltipPositionBuilder().fromTopLeft().attachBottomLeft().getPosition(),
  new TooltipPositionBuilder().fromTopLeft().attachBottomRight().getPosition(),
];

export class StackedAreaTooltipPositioner extends TooltipPositioner {
  constructor(
    private anchor: {
      x: number;
      yAreaTop: number;
      yAreaBottom: number;
      yChartTop: number;
      yChartBottom: number;
    }
  ) {
    super();
  }

  fromAnchor(
    relativeTo: 'area' | 'chart',
    offset: { x: number; y: number }
  ): HtmlTooltipCdkManagedPosition {
    const positionsWithOffsets = new TooltipPositionBuilder().applyOffsets(
      DEFAULT_POSITIONS,
      this.anchor.x + offset.x,
      relativeTo === 'area'
        ? this.anchor.yAreaTop - offset.y
        : this.anchor.yChartTop - offset.y
    );
    return new HtmlTooltipCdkManagedPosition(positionsWithOffsets);
  }
}
