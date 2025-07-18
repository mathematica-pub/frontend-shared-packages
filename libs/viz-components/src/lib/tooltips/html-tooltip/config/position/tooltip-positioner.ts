import {
  HtmlTooltipCdkManagedPosition,
  TooltipPosition,
} from './tooltip-position';

export abstract class TooltipPositioner {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract fromAnchor(...args: any): HtmlTooltipCdkManagedPosition;

  customPosition(positions: TooltipPosition[]): HtmlTooltipCdkManagedPosition {
    return new HtmlTooltipCdkManagedPosition(positions);
  }
}
