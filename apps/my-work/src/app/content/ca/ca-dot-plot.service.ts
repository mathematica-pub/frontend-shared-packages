/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  VicChartConfigBuilder,
  VicStackedBarsConfigBuilder,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
} from '@mathstack/viz';
import { max, min } from 'd3';
import { chartWidth } from './ca.constants';
import { DotPlotService } from './dot-plot.service';

export interface DotPlotDataConfig {
  data: any[];
  yDimension: string;
  isPercentile?: boolean;
  isMlb?: boolean;
  getCurrentRollup?: (a: any, b: any) => boolean;
  bandwidth?: number;
  labelWidth?: number;
}

@Injectable()
export class CaDotPlotService extends DotPlotService {
  override xAxisConfig: VicXQuantitativeAxisConfig<number>;
  override yAxisConfig: VicYOrdinalAxisConfig<string>;
  isPercentile = false;
  yDimension: string;

  constructor(
    private bars: VicStackedBarsConfigBuilder<any, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>,
    private chartConfigBuilder: VicChartConfigBuilder
  ) {
    super();
  }

  onChanges(config: DotPlotDataConfig): void {
    console.log('data after changes', config.data);
    this.data = config.data;
    this.isPercentile = config.isPercentile;
    this.yDimension = config.yDimension;
    this.bandwidth = config.bandwidth ?? 15;
    this.labelWidth = config.labelWidth ?? Infinity;
    if (config.isMlb) {
      this.setMlbData();
    } else {
      this.setInterimData(config.getCurrentRollup);
    }
  }

  override getInvisibleStackValue(d: any) {
    return this.isPercentile
      ? (min([d.percentile25, d.percentile75]) ?? null)
      : d.value;
  }

  getBarValue(d: any): number {
    return this.isPercentile ? d.percentile75 : d.value;
  }

  getYDimension(d: any): string {
    return d[this.yDimension];
  }

  setProperties(getSortOrder: (a: any, b: any) => number): void {
    if (this.rollupData.length > 0) {
      const chartHeight = this.rollupData.length * this.bandwidth * 2;

      this.chartConfig = this.chartConfigBuilder
        .margin({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        })
        .maxHeight(chartHeight)
        .maxWidth(chartWidth)
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
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.value).domain([0, this.trueMax])
            )
            .y((dimension) =>
              dimension.valueAccessor((d) => this.getYDimension(d))
            )
        )
        .color((dimension) => dimension.valueAccessor((d) => d.series))
        .datumClass((d) => (d.series === 'invisible' ? 'invisible' : 'visible'))
        .stackOrder(() => [1, 0])
        .getConfig();

      this.yAxisConfig = this.yOrdinalAxis
        .ticks((ticks) =>
          ticks
            .sizeOuter(0)
            .wrap((wrap) => wrap.width(this.labelWidth).maintainYPosition(true))
        )
        .baseline((baseline) => baseline.display())
        .grid((grid) => grid.filter(() => true))
        .getConfig();
      this.xAxisConfig = this.xQuantitativeAxis
        .ticks((ticks) =>
          ticks.format(this.getTickFormat()).count(5).sizeOuter(0)
        )
        .grid()
        .getConfig();
    }
  }
}
