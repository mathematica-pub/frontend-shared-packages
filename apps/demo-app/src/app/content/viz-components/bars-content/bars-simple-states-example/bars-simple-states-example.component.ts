import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BarsConfig,
  ChartConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import {
  LocationCategoryDatum,
  statesElectionData,
} from '../../data/location-category-data';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: BarsConfig<LocationCategoryDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<number>;
}

@Component({
  selector: 'app-bars-simple-states-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
  ],
  templateUrl: './bars-simple-states-example.component.html',
  styleUrl: './bars-simple-states-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicChartConfigBuilder,
    VicBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
})
export class BarsSimpleStatesExampleComponent implements OnInit {
  vm: ViewModel;

  constructor(
    private chart: VicChartConfigBuilder,
    private bars: VicBarsConfigBuilder<LocationCategoryDatum, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.getViewModel();
  }

  getViewModel(): void {
    const chartConfig = this.chart
      .margin({
        top: 0,
        right: 0,
        bottom: 24,
        left: 80,
      })
      .height(160)
      .height(400)
      .resize({ height: false })
      .getConfig();

    const xAxisConfig = this.xQuantitativeAxis
      .tickFormat('.0%')
      .numTicks(5)
      .label((label) =>
        label.text('Percentage of Population').offset({ y: 12 })
      )
      .getConfig();

    const yAxisConfig = this.yOrdinalAxis
      .removeDomainLine()
      .removeTickMarks()
      .getConfig();

    const dataConfig = this.bars
      .data(
        statesElectionData
          .filter((d) => d.category === 'D')
          .slice()
          .sort((a, b) => b.value - a.value)
      )
      .horizontal((bars) =>
        bars
          .x((x) =>
            x
              .valueAccessor((d) => d.value)
              .domainPaddingRoundUpToInterval(() => 0.2)
          )
          .y((y) => y.valueAccessor((d) => d.location))
      )
      .color((color) => color.range(['royalblue']))
      .getConfig();

    this.vm = {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
