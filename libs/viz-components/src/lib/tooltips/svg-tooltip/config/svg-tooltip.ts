import { Tooltip } from '../../config/tooltip';

export class SvgTooltip extends Tooltip {
  override type = 'svg' as const;
}
