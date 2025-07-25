import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import {
  ChartConfig,
  StackedBarsConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { descending, extent, max, min } from 'd3';
import { sizeCategories } from '../../ca-access.constants';
import { IcaStackedBarsComponent } from './ica-stacked-bars/ica-stacked-bars.component';

export interface IcaDatum {
  series: string;
  size: string;
  county: string;
  plans: number[];
  ica_25: number;
  ica_75: number;
  measureCode: string;
  stratVal: string;
  delivSys: string;
  value: number;
  planValue: number;
  units: string;
  directionality: string;
}

@Component({
  selector: 'app-ica-dot-plot',
  standalone: true,
  imports: [VicChartModule, VicXyAxisModule, IcaStackedBarsComponent],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
  ],
  templateUrl: './ica-dot-plot.component.html',
  styleUrl: './ica-dot-plot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IcaDotPlotComponent implements OnChanges {
  @Input() data: IcaDatum[];
  chartConfig: ChartConfig;
  rollupData: IcaDatum[] = [];
  rollupDataConfig: StackedBarsConfig<IcaDatum, string>;
  xAxisConfig: VicXQuantitativeAxisConfig<number>;
  yAxisConfig: VicYOrdinalAxisConfig<string>;
  trueMax: number;

  constructor(
    private bars: VicStackedBarsConfigBuilder<IcaDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>,
    private chartConfigBuilder: VicChartConfigBuilder
  ) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data after changes', this.data);
      this.setProperties();
    }
  }

  setProperties(): void {
    this.rollupData = [];

    this.data
      .filter((plan) => plan.planValue !== null)
      .forEach((plan) => {
        const visibleStack = structuredClone(plan);
        const currentRollup = this.rollupData.find(
          (x) => x.county === plan.county
        );
        const currentInvisibleRollup = this.rollupData.find(
          (x) => x.county === plan.county && x.series === 'invisible'
        );
        if (!currentRollup) {
          visibleStack.plans = [plan.planValue];

          const invisibleStack = structuredClone(plan);
          invisibleStack.series = 'invisible';
          invisibleStack.plans = [plan.planValue];

          this.rollupData.push(visibleStack);
          this.rollupData.push(invisibleStack);
        } else {
          currentRollup.plans.push(plan.planValue);
          currentInvisibleRollup.plans.push(plan.planValue);
          currentInvisibleRollup.value = min(currentInvisibleRollup.plans);
        }
      });

    this.rollupData
      .filter(
        (category) =>
          category.planValue !== null && category.series !== 'invisible'
      )
      .forEach((category) => {
        const extents = extent(category.plans);
        category.value = extents[1] - extents[0];
      });

    this.rollupData = this.rollupData.filter((d) => d.plans.length > 1);

    if (this.rollupData.length > 0) {
      const chartHeight = this.rollupData.length * 15;

      this.chartConfig = this.chartConfigBuilder
        .margin({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        })
        .maxHeight(chartHeight)
        .maxWidth(660)
        .scalingStrategy('fixed')
        .fixedHeight(true)
        .transitionDuration(0)
        .getConfig();

      this.trueMax = max(this.rollupData.map((d) => max(d.plans)));
      if (this.trueMax < 1 && this.trueMax > 0.8) this.trueMax = 1;

      this.rollupData
        .sort((a, b) => {
          const extentA = extent(a.plans);
          const extentB = extent(b.plans);
          const diffA = extentA[1] - extentA[0];
          const diffB = extentB[1] - extentB[0];
          return descending(diffA, diffB);
        })
        .sort(
          (a, b) =>
            sizeCategories.indexOf(a.size) - sizeCategories.indexOf(b.size)
        );

      console.log('rollupData', this.rollupData);

      this.rollupDataConfig = this.bars
        .data(this.rollupData)
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.value).domain([0, this.trueMax])
            )
            .y((dimension) => dimension.valueAccessor((d) => d.county))
        )
        .color((dimension) => dimension.valueAccessor((d) => d.series))
        .stackOrder(() => [1, 0])
        .getConfig();

      this.yAxisConfig = this.yOrdinalAxis
        .ticks((ticks) => ticks.sizeOuter(0))
        .grid((grid) => grid.filter(() => true))
        .baseline((baseline) => baseline.display())
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
