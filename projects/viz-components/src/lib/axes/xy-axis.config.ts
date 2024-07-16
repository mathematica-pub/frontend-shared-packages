import { VicTickWrapConfig } from '../svg-text-wrap/tick-wrap.config';

export abstract class VicXyAxisConfig<TickValue> {
  removeDomain: boolean;
  removeTickMarks: boolean;
  removeTicks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  tickSizeOuter: number;
  wrap: VicTickWrapConfig;

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
