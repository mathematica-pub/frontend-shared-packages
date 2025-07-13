import { TooltipPosition } from '../../events';
import { MarksInteractionOutput } from '../../events/interaction-output';
import { HtmlTooltipCdkManagedPosition } from '../../tooltips';
import { DotsTooltipDatum } from '../dots.component';

export interface DotsInteractionOutput<Datum>
  extends DotsTooltipDatum<Datum>,
    MarksInteractionOutput {
  /**
   * A method that returns a position for the tooltip above the pointer for HoverMove or Click actions or above the center of the dot for Hover actions.
   *
   * @param yOffset - Optional offset from the pointer's y position.
   */
  fromAnchor: (
    offset?: Partial<{ x: number; y: number }>
  ) => HtmlTooltipCdkManagedPosition;
  /**
   * A method that allows a user to define custom positions for the tooltip.
   */
  customPosition: (
    positions: TooltipPosition[]
  ) => HtmlTooltipCdkManagedPosition;
}
