import {
  HtmlTooltipCdkManagedPosition,
  TooltipPosition,
} from '../tooltips/html-tooltip/config/position/tooltip-position';

export const DEFAULT_TOOLTIP_Y_OFFSET = 2;

export abstract class TooltipPositioner {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract fromAnchor(...args: any): HtmlTooltipCdkManagedPosition;

  customPosition(positions: TooltipPosition[]): HtmlTooltipCdkManagedPosition {
    return new HtmlTooltipCdkManagedPosition(positions);
  }
}
