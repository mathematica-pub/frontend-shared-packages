import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ChartConfig,
  DotsConfig,
  ElementSpacing,
  VicChartConfigBuilder,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import {
  LocationCategoryDatum,
  statesElectionData,
} from '../../data/location-category-data';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: DotsConfig<LocationCategoryDatum>;
  xAxisConfig: VicXQuantitativeAxisConfig<number>;
  yAxisConfig: VicYOrdinalAxisConfig<number>;
}

@Component({
  selector: 'app-dots-ordinal-quant-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicDotsModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
  ],
  templateUrl: './dots-ordinal-quant-example.component.html',
  styleUrl: './dots-ordinal-quant-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicChartConfigBuilder,
    VicDotsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
})
export class DotsOrdinalQuantExampleComponent implements OnInit {
  vm: ViewModel;
  margin: ElementSpacing = {
    top: 0,
    right: 0,
    bottom: 40,
    left: 80,
  };

  constructor(
    private chart: VicChartConfigBuilder,
    private dots: VicDotsConfigBuilder<LocationCategoryDatum>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.getViewModel();
  }

  getViewModel(): void {
    const chartConfig = this.chart
      .margin(this.margin)
      .height(160)
      .width(400)
      .scalingStrategy('responsive-width')
      .getConfig();

    const xAxisConfig = this.xQuantitativeAxis
      .ticks((ticks) => ticks.format('.0%').size(0).count(5))
      .baseline((baseline) => baseline.display(false))
      .getConfig();
    const yAxisConfig = this.yOrdinalAxis
      .ticks((ticks) => ticks.size(0))
      .baseline((baseline) => baseline.display(false))
      .getConfig();

    const dataConfig = this.dots
      .data(statesElectionData)
      .opacity(0.8)
      .xNumeric((x) =>
        x
          .valueAccessor((d) => d.value)
          .domain([0.42, 0.52])
          .includeZeroInDomain(false)
      )
      .yOrdinal((y) => y.valueAccessor((d) => d.location))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.category).range(['royalblue', 'red'])
      )
      .radius(5)
      .getConfig();

    this.vm = {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}
