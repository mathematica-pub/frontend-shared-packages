/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  ChartConfig,
  StackedBarsConfig,
  VicChartConfigBuilder,
  VicStackedBarsConfigBuilder,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { extent, max, min } from 'd3';
import { chartWidth } from './ca.constants';

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
export class CaDotPlotService {
  data: any[];
  chartConfig: ChartConfig;
  rollupData: any[] = [];
  rollupDataConfig: StackedBarsConfig<any, string>;
  xAxisConfig: VicXQuantitativeAxisConfig<number>;
  yAxisConfig: VicYOrdinalAxisConfig<string>;
  trueMax: number;
  labelWidth: number;
  bandwidth: number;
  isPercentile = false;
  yDimension: string;

  constructor(
    private bars: VicStackedBarsConfigBuilder<any, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>,
    private chartConfigBuilder: VicChartConfigBuilder
  ) {}

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

  getInvisibleStackValue(d: any) {
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

  setInterimData(getCurrentRollup: (a: any, b: any) => boolean): void {
    this.rollupData = [];

    this.data
      .filter((plan) => plan.planValue !== null)
      .forEach((plan) => {
        const visibleStack = structuredClone(plan);
        const currentRollup = this.rollupData.find((x) =>
          getCurrentRollup(x, plan)
        );
        if (!currentRollup) {
          visibleStack.plans = [plan.planValue];

          const invisibleStack = structuredClone(plan);
          invisibleStack.series = 'invisible';
          invisibleStack.value = this.getInvisibleStackValue(plan);

          this.rollupData.push(visibleStack);
          this.rollupData.push(invisibleStack);
        } else {
          currentRollup.plans.push(plan.planValue);
        }
      });
  }

  setMlbData(): void {
    this.rollupData = structuredClone(this.data);

    this.data.forEach((d) => {
      const invisibleStack = structuredClone(d);
      invisibleStack.series = 'invisible';
      invisibleStack.value = this.getInvisibleStackValue(d);
      this.rollupData.push(invisibleStack);
    });
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

  getTickFormat(nonRollupData?: any[]): string {
    const data = nonRollupData || this.rollupData;
    const units = data.find((category) => category.units !== null).units;
    const trueMax = this.trueMax || max(data, (d) => d.value);
    let format = ',.0f';
    if (units === 'Percentage') {
      if (trueMax < 0.1) {
        format = '.1%';
      } else {
        format = '.0%';
      }
    } else if (trueMax < 10) {
      format = ',.1f';
    }
    return format;
  }

  setHeight(dataAccessor: string): void {
    const uniqueRows = this.rollupData.reduce((set, d) => {
      set.add(d.series + d[dataAccessor]);
      return set;
    }, new Set());
    this.chartConfig.height = uniqueRows.size * this.bandwidth;
  }

  setBdaMockCategories(order: any): void {
    order.race['Race 1 covers two lines'] = 0;
    order.race['Race 2'] = 1;
    order.race['Race 3 covers two lines'] = 2;
    order.race[`Race 4 covers three lines because it's long`] = 3;
    order.race['Race 5'] = 4;
    order.race['No Race Selection and Race 1 or Race 2 Ethnicity'] = 5;
    order.race['Some Other Race'] = 6;
    order.race['Two or More Races'] = 7;
    order.ethnicity['Ethnicity 1 covers two lines'] = 9;
    order.ethnicity['Ethnicity 2 covers two lines'] = 10;
  }

  getCategoryData(strat: string, stratVal: string): any[] {
    return this.rollupData.filter(
      (category) =>
        category.strat.toLowerCase().includes(strat) &&
        category.stratVal === stratVal
    );
  }

  getMatchingStrat(strat: string): any {
    return this.rollupData.find(
      (category) => category.strat.toLowerCase() === strat
    );
  }

  addCategory(emptyCategory: any): void {
    const invisibleCategory = structuredClone(emptyCategory);
    invisibleCategory.series = 'invisible';

    this.rollupData.push(...[emptyCategory, invisibleCategory]);
  }

  setExtents(): void {
    this.rollupData.forEach((d) => {
      const row = this.rollupData.filter((category) => {
        const categoryValue = category.strat ? 'stratVal' : 'county';
        return (
          category[categoryValue] === d[categoryValue] &&
          category.series === d.series &&
          category.strat === d.strat
        );
      });
      if (d.series === 'invisible') {
        d.value = min(row.map((lob) => lob.average)) || null;
      } else {
        const extents = extent(row.map((lob) => lob.average));
        d.value = extents[1] - extents[0] || null;
      }
    });
  }
}
