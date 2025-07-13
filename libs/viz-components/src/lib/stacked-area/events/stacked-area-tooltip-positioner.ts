import { HtmlTooltipCdkManagedPosition, TooltipPosition } from '../../tooltips';
import { TooltipPositionBuilder } from '../../tooltips/html-tooltip/config/position/tooltip-position-builder';

export class StackedAreaTooltipPositioner {
  constructor(
    private anchor: {
      x: number;
      yAreaTop: number;
      yAreaBottom: number;
      yChartTop: number;
      yChartBottom: number;
    }
  ) {}

  fromAnchor(
    relativeTo: 'area' | 'chart',
    offset: { x: number; y: number }
  ): HtmlTooltipCdkManagedPosition {
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
      relativeTo === 'area'
        ? this.anchor.yAreaTop - offset.y
        : this.anchor.yChartTop - offset.y
    );
    return new HtmlTooltipCdkManagedPosition(positionsWithOffsets);
  }

  customPosition(positions: TooltipPosition[]): HtmlTooltipCdkManagedPosition {
    return new HtmlTooltipCdkManagedPosition(positions);
  }
}
