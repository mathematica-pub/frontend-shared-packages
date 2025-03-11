import { MarksConfig } from '../../../marks/config/marks-config';
import { AxisLabel } from '../../axis-label/axis-label-config';
import { Grid } from '../../grid/grid-config';
import { TickWrap } from '../../tick-wrap/tick-wrap';
import { XyAxisBaseOptions } from './xy-axis-options';

export abstract class XyAxisConfig<TickValue>
  extends MarksConfig
  implements XyAxisBaseOptions<TickValue>
{
  grid: Grid;
  label: AxisLabel;
  removeDomainLine: boolean;
  removeTickLabels: boolean;
  removeTickMarks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
  zeroAxis: { strokeDasharray: string | null; useZeroAxis: boolean };

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
