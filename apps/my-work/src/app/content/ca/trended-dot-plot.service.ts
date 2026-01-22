/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  VicChartConfigBuilder,
  VicStackedBarsConfigBuilder,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@mathstack/viz';
import { max, min } from 'd3';
import { chartWidth } from './ca.constants';
import { DotPlotService } from './dot-plot.service';

export interface TrendedDotPlotDataConfig {
  data: any[];
  xDimension: string;
}

@Injectable()
export class TrendedDotPlotService extends DotPlotService {
  override yAxisConfig: VicYQuantitativeAxisConfig<number>;
  override xAxisConfig: VicXOrdinalAxisConfig<string>;
  override bandwidth = 15;
  xDimension: string;

  constructor(
    private bars: VicStackedBarsConfigBuilder<any, string>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>,
    private chartConfigBuilder: VicChartConfigBuilder
  ) {
    super();
  }

  onChanges(config: TrendedDotPlotDataConfig): void {
    console.log('data after changes', config.data);
    this.data = config.data;
    this.xDimension = config.xDimension;
    this.setMlbData();
  }

  override getInvisibleStackValue(d: any) {
    return min([d.percentile25, d.percentile75]) ?? null;
  }

  getBarValue(d: any): number {
    return d.percentile75;
  }

  getYDimension(d: any): string {
    return d[this.xDimension];
  }

  setProperties(getSortOrder: (a: any, b: any) => number): void {
    if (this.rollupData.length > 0) {
      const calculatedWidth = this.rollupData.length * this.bandwidth * 2;

      this.chartConfig = this.chartConfigBuilder
        .margin({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        })
        .maxHeight(chartWidth)
        .minWidth(calculatedWidth)
        .maxWidth(calculatedWidth)
        .scalingStrategy('fixed')
        .fixedHeight(true)
        .transitionDuration(0)
        .getConfig();

      const dotMax = max(this.rollupData.map((d) => d.average));
      const barMax = max(this.rollupData, (d) => this.getBarValue(d));
      this.trueMax = max([dotMax, barMax]) * 1.1;
      const isPercentage =
        this.rollupData.find((category) => category.units !== null).units ===
        'Percentage';
      if (isPercentage) {
        this.trueMax = min([this.trueMax, 1]);
      }

      this.rollupData.sort((a, b) => getSortOrder(a, b));

      this.rollupData.forEach((d) => {
        if ('strat' in d) {
          // add a space to distinguish between duplicate stratVals (race and ethnicity)
          const ethnicitySpace =
            (d.strat as string).toLowerCase() === 'ethnicity' ? ' ' : '';
          d.stratVal = d.stratVal + ethnicitySpace;
        }
      });

      console.log('rollupData', this.rollupData);

      this.rollupDataConfig = this.bars
        .data(this.rollupData)
        .vertical((bars) =>
          bars
            .y((dimension) =>
              dimension.valueAccessor((d) => d.value).domain([0, this.trueMax])
            )
            .x((dimension) =>
              dimension.valueAccessor((d) => this.getYDimension(d))
            )
        )
        .color((dimension) => dimension.valueAccessor((d) => d.series))
        .stackOrder(() => [1, 0])
        .getConfig();

      this.yAxisConfig = this.yQuantitativeAxis
        .ticks((ticks) =>
          ticks.format(this.getTickFormat()).count(5).sizeOuter(0)
        )
        .baseline((baseline) => baseline.display())
        .grid()
        .getConfig();
      this.xAxisConfig = this.xOrdinalAxis
        .ticks((ticks) =>
          ticks
            .sizeOuter(0)
            .wrap((wrap) => wrap.width(this.labelWidth).maintainYPosition(true))
        )
        .baseline((baseline) => baseline.display())
        .grid()
        .getConfig();
    }
  }
}
