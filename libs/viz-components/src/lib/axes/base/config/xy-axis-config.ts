import { DataValue } from '../../../core/types/values';
import { MarksConfig } from '../../../marks/config/marks-config';
import { AxisBaseline } from '../../baseline/axis-baseline';
import { Grid } from '../../grid/grid-config';
import { AxisLabel } from '../../label/axis-label';
import { Ticks } from '../../ticks/ticks';
import { XyAxisBaseOptions } from './xy-axis-options';

export abstract class XyAxisConfig<
    Tick extends DataValue,
    TicksConfig extends Ticks<Tick>,
  >
  extends MarksConfig
  implements XyAxisBaseOptions
{
  baseline: AxisBaseline;
  grid: Grid;
  label: AxisLabel;
  ticks: TicksConfig;

  abstract getNumTicksBySpacing(
    spacing: number,
    dimensions: {
      height: number;
      width: number;
    }
  ): number;

  getValidatedNumTicks(numTicks: number): number {
    if (numTicks < 1) {
      return 1;
    }
    return Math.floor(numTicks);
  }
}
