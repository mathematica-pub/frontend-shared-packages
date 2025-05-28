/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import {
  ChartConfig,
  StackedBarsConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { max, min } from 'd3';
import { MlbDatum } from './mlb-stacked-bars.component';

@Component({
  selector: 'app-mlb-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXyAxisModule,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
  ],
  templateUrl: 'mlb-dot-plot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MlbDotPlotComponent implements OnChanges {
  @Input() data: MlbDatum[];
  chartConfig: ChartConfig;
  rollupData: MlbDatum[] = [];
  rollupDataConfig: StackedBarsConfig<any, string>;
  xAxisConfig: VicXQuantitativeAxisConfig<number>;
  yAxisConfig: VicYOrdinalAxisConfig<string>;
  trueMax: number;
  labelWidth = Infinity;
  bandwidth = 15;

  constructor(
    private bars: VicStackedBarsConfigBuilder<any, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>,
    private chartConfigBuilder: VicChartConfigBuilder
  ) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data after changes', this.data);
      this.setData();
      this.setProperties();
    }
  }

  // eslint-disable-next-line
  getCurrentRollup(x: MlbDatum, plan: MlbDatum): boolean {
    console.error('override getCurrentRollup');
    return false;
  }

  getInvisibleStackValue(plan: MlbDatum): number {
    console.error('override getInvisibleStackValue');
    return plan.average;
  }

  getBarValue(plan: MlbDatum): number {
    console.error('override getBarValue');
    return plan.value;
  }

  // eslint-disable-next-line
  getSortOrder(a: MlbDatum, b: MlbDatum): number {
    console.error('override getSortOrder');
    return 0;
  }

  getYDimension(plan: MlbDatum): string {
    console.error('override getYDimension');
    return plan.stratVal;
  }

  setData(): void {
    this.rollupData = structuredClone(this.data);

    this.data.forEach((plan) => {
      const invisibleStack = structuredClone(plan);
      invisibleStack.series = 'invisible';
      invisibleStack.value = this.getInvisibleStackValue(plan);
      this.rollupData.push(invisibleStack);
    });
  }

  setProperties(): void {
    if (this.rollupData.length > 0) {
      const chartHeight = this.rollupData.length * this.bandwidth * 2;

      this.chartConfig = this.chartConfigBuilder
        .margin({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        })
        .height(chartHeight)
        .width(700)
        .resize({
          width: false,
          height: false,
          useViewbox: false,
        })
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

      this.rollupData.sort((a, b) => this.getSortOrder(a, b));

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

  getTickFormat(): string {
    const units = this.rollupData.find(
      (category) => category.units !== null
    ).units;
    if (units === 'Percentage') {
      if (this.trueMax < 0.1) {
        return '.1%';
      } else {
        return '.0%';
      }
    } else if (this.trueMax < 10) {
      return ',.1f';
    } else {
      return ',.0f';
    }
  }
}
