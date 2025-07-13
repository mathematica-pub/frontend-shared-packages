import { DataValue } from '../../core/types/values';
import { BaseInteractionOutput } from '../../events/interaction-output';
import { HtmlTooltipCdkManagedPosition, TooltipPosition } from '../../tooltips';
import { StackedAreaTooltipDatum } from '../stacked-area.component';

export interface StackedAreaInteractionAnchor {
  x: number;
  yAreaTop: number;
  yAreaBottom: number;
  yChartTop: number;
  yChartBottom: number;
}

export interface StackedAreaInteractionOutput<
  Datum,
  TCategoricalValue extends DataValue,
> extends BaseInteractionOutput {
  anchor: StackedAreaInteractionAnchor;
  data: StackedAreaTooltipDatum<Datum, TCategoricalValue>[];
  hoveredAreaDatum: StackedAreaTooltipDatum<Datum, TCategoricalValue>;
  defaultPositionFromArea: HtmlTooltipCdkManagedPosition;
  defaultPositionFromChart: HtmlTooltipCdkManagedPosition;
  /**
   * A method that positions the tooltip with a user specified offset from the tooltip's anchor point.
   *
   * @param offset - Optional offset from the anchor's x and y position.
   * If not provided, defaults to { x: 0, y: 0 }.
   * If provided, the x value is added to the anchor's x position (moves tooltip right) and the y value is subtracted from the anchor's y position (moves tooltip up).
   */
  fromAnchor: (
    relativeTo: 'area' | 'chart',
    offset?: Partial<{ x: number; y: number }>
  ) => HtmlTooltipCdkManagedPosition;
  /**
   * A method that allows a user to provide custom positions for the tooltip.
   */
  customPosition: (
    positions: TooltipPosition[]
  ) => HtmlTooltipCdkManagedPosition;
}
