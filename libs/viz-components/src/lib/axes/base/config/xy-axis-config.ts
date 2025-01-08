import { AxisLabel } from '../../axis-label/axis-label-config';
import { Grid } from '../../grid/grid-config';
import { TickWrap } from '../../tick-wrap/tick-wrap';
import { XyAxisBaseOptions } from './xy-axis-options';

export abstract class XyAxisConfig<TickValue>
  implements XyAxisBaseOptions<TickValue>
{
  data: never;
  label: AxisLabel;
  mixBlendMode: string;
  removeDomainLine: boolean;
  removeTickLabels: boolean;
  removeTickMarks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
  grid: Grid;

  abstract getSuggestedNumTicksFromChartDimension(dimensions: {
    height: number;
    width: number;
  }): number;

  getValidatedNumTicks(numTicks: number): number {
    if (numTicks < 1) {
      return 1;
    }
    return Math.floor(numTicks);
  }
}
