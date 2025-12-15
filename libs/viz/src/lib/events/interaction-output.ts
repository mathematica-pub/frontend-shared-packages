import { EventType } from '../events';
import { HtmlTooltipCdkManagedPosition, TooltipPosition } from '../tooltips';

export interface InteractionOutput<Anchor = { x: number; y: number }> {
  /**
   * If used with Hover actions, the coordinates of the center of the origin element relative to the top left corner of the origin.
   *
   * If used with HoverMove actions, the position of the pointer relative to the top left corner of the origin element.
   */
  anchor: Anchor;
  /**
   * The origin element of the tooltip.
   */
  origin: SVGGraphicsElement;
  /**
   * The type of the event that triggered the interaction.
   */
  type: EventType;
  /**
   * The default position of the tooltip.
   */
  defaultPosition: HtmlTooltipCdkManagedPosition;
  /**
   * A method that positions the tooltip with a user specified offset from the tooltip's anchor point.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromAnchor: (...args: any[]) => HtmlTooltipCdkManagedPosition;
  /**
   * A method that allows a user to provide custom positions for the tooltip.
   */
  customPosition: (
    positions: TooltipPosition[]
  ) => HtmlTooltipCdkManagedPosition;
}
