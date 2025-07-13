import { TooltipPosition } from '../../events';
import { TooltipPositionBuilder2 } from '../../events/event-positions-new';
import { HtmlTooltipCdkManagedPosition } from '../../tooltips';

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
      new TooltipPositionBuilder2()
        .fromTopLeft()
        .attachBottomCenter()
        .getPosition(),
      new TooltipPositionBuilder2()
        .fromTopLeft()
        .attachBottomLeft()
        .getPosition(),
      new TooltipPositionBuilder2()
        .fromTopLeft()
        .attachBottomRight()
        .getPosition(),
    ];
    const positionsWithOffsets = new TooltipPositionBuilder2().applyOffsets(
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
