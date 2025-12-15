import { InteractionOutput } from '../../events/interaction-output';
import { HtmlTooltipCdkManagedPosition } from '../../tooltips';
import { LinesTooltipDatum } from '../lines.component';

export interface LinesInteractionOutput<Datum>
  extends LinesTooltipDatum<Datum>,
    InteractionOutput {
  /**
   * A method that positions the tooltip with a user specified offset from the tooltip's anchor point.
   *
   * @param offset - Optional offset from the anchor's x and y position.
   * If not provided, defaults to { x: 0, y: 0 }.
   * If provided, the x value is added to the anchor's x position (moves tooltip right) and the y value is subtracted from the anchor's y position (moves tooltip up).
   */
  fromAnchor: (
    offset?: Partial<{ x: number; y: number }>
  ) => HtmlTooltipCdkManagedPosition;
}
