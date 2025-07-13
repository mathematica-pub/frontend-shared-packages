import { EventType } from '../events';
import { HtmlTooltipCdkManagedPosition, TooltipPosition } from '../tooltips';

export interface BaseInteractionOutput {
  /**
   * The origin element of the tooltip.
   */
  origin: SVGGraphicsElement;
  /**
   * A method that allows a user to provide custom positions for the tooltip.
   */
  customPosition: (
    positions: TooltipPosition[]
  ) => HtmlTooltipCdkManagedPosition;
  defaultPosition: HtmlTooltipCdkManagedPosition;
  /**
   * The type of the event that triggered the interaction.
   */
  type: EventType;
}

export interface MarksInteractionOutput extends BaseInteractionOutput {
  /**
   * If used with Hover actions, the x and y coordinates of the center of the origin element relative to the top left corner of the origin.
   *
   * If used with HoverMove actions, the position of the pointer relative to the top left corner of the origin element.
   *
   */
  anchor: {
    x: number;
    y: number;
  };
}
