import { GridLines } from '../../grid-lines/grid-lines-config';
import { TickWrap } from '../../tick-wrap/tick-wrap-config';
import { XyAxisBaseOptions } from './xy-axis-options';

export abstract class XyAxisConfig<TickValue>
  implements XyAxisBaseOptions<TickValue>
{
  data: never;
  mixBlendMode: string;
  removeDomainLine: boolean;
  removeTickMarks: boolean;
  removeTicks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: TickWrap;
  gridLines: GridLines;

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
