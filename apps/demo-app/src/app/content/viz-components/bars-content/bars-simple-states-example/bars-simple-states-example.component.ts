import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  BarsConfig,
  ChartConfig,
  ElementSpacing,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { cloneDeep } from 'lodash-es';
import {
  LocationCategoryDatum,
  statesElectionData,
  statesElectionDataPosNeg,
} from '../../data/location-category-data';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: BarsConfig<LocationCategoryDatum, string>;
  ordinalAxisConfig:
    | VicXOrdinalAxisConfig<string>
    | VicYOrdinalAxisConfig<string>;
  quantitativeAxisConfig:
    | VicXQuantitativeAxisConfig<number>
    | VicYQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-bars-simple-states-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
  ],
  templateUrl: './bars-simple-states-example.component.html',
  styleUrl: './bars-simple-states-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicChartConfigBuilder,
    VicBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
  ],
})
export class BarsSimpleStatesExampleComponent implements OnInit {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() margin: ElementSpacing = {
    top: 0,
    right: 0,
    bottom: 24,
    left: 80,
  };
  @Input() width = 400;
  @Input() height = 160;
  @Input() useLabels = false;
  @Input() useBackgrounds = false;
  @Input() usePosNegData = false;
  @Input() useLongLabelsAndWrap = false;
  vm: ViewModel;

  constructor(
    private chart: VicChartConfigBuilder,
    private bars: VicBarsConfigBuilder<LocationCategoryDatum, string>,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.getViewModel();
  }

  getViewModel(): void {
    let ordinalAxisConfig:
      | VicXOrdinalAxisConfig<string>
      | VicYOrdinalAxisConfig<string>;
    let quantitativeAxisConfig:
      | VicXQuantitativeAxisConfig<number>
      | VicYQuantitativeAxisConfig<number>;

    const chartConfig = this.chart
      .margin(this.margin)
      .height(this.height)
      .width(this.width)
      .scalingStrategy(this.useLongLabelsAndWrap ? 'fixed' : 'responsive-width')
      .getConfig();

    if (this.orientation === 'horizontal') {
      this.yOrdinalAxis.ticks((ticks) => ticks.size(0));
      if (this.useLongLabelsAndWrap) {
        this.yOrdinalAxis.ticks((ticks) =>
          ticks.wrap((wrap) => wrap.width(120))
        );
      }
      ordinalAxisConfig = this.yOrdinalAxis.getConfig();

      quantitativeAxisConfig = this.xQuantitativeAxis
        .ticks((ticks) =>
          ticks.format(this.usePosNegData ? '.1%' : '.0%').count(5)
        )
        .label((label) =>
          label.text('Percentage of Population').offset({ y: 12 })
        )
        .getConfig();
    } else {
      this.xOrdinalAxis.ticks((ticks) => ticks.size(0));
      if (!this.useLongLabelsAndWrap) {
        this.xOrdinalAxis.ticks((ticks) =>
          ticks.format((state) => this.getStateAbbreviation(state))
        );
      } else {
        this.xOrdinalAxis.ticks((ticks) =>
          ticks.wrap((wrap) => wrap.width(100))
        );
      }
      ordinalAxisConfig = this.xOrdinalAxis.getConfig();
      quantitativeAxisConfig = this.yQuantitativeAxis
        .ticks((ticks) =>
          ticks.format(this.usePosNegData ? '.1%' : '.0%').count(5)
        )
        .label((label) => label.text('Percentage of Population'))
        .getConfig();
    }

    let chartData = this.usePosNegData
      ? statesElectionDataPosNeg.filter((d) => d.category === '2020')
      : statesElectionData.filter((d) => d.category === 'D');

    chartData = chartData.slice().sort((a, b) => b.value - a.value);

    chartData = this.useLongLabelsAndWrap
      ? cloneDeep(chartData).map((d) => {
          if (d.location === 'Nevada') {
            d.location = 'Nevada, a state in the Mountain West';
          } else if (d.location === 'Wisconsin') {
            d.location = 'Wisconsin, a state in the Midwest';
          } else if (d.location === 'North Carolina') {
            d.location = 'North Carolina, a state in the South';
          } else if (d.location === 'Georgia') {
            d.location = 'Georgia, a state in the South';
          } else if (d.location === 'Pennsylvania') {
            d.location = 'Pennsylvania, a state in the Mid-Atlantic';
          } else if (d.location === 'Michigan') {
            d.location = 'Michigan, a state in the Midwest';
          } else if (d.location === 'Arizona') {
            d.location = 'Arizona, a state in the Southwest';
          }
          return d;
        })
      : cloneDeep(chartData);

    const dataConfig = this.bars
      .data(chartData)
      .horizontal(
        this.orientation === 'horizontal'
          ? (bars) =>
              bars
                .x((x) =>
                  x
                    .valueAccessor((d) => d.value)
                    .domainPaddingRoundUpToInterval(() => 0.2)
                    .formatSpecifier('.0%')
                )
                .y((y) => y.valueAccessor((d) => d.location))
          : null
      )
      .vertical(
        this.orientation === 'vertical'
          ? (bars) =>
              bars
                .x((x) => x.valueAccessor((d) => d.location))
                .y((y) =>
                  y
                    .valueAccessor((d) => d.value)
                    .domainPaddingRoundUpToInterval(() => 0.2)
                    .formatSpecifier('.0%')
                )
          : null
      )
      .backgrounds(this.useBackgrounds ? undefined : null)
      .labels(this.useLabels ? undefined : null)
      .color((color) => color.range(['royalblue']))
      .getConfig();

    this.vm = {
      chartConfig,
      dataConfig,
      ordinalAxisConfig,
      quantitativeAxisConfig,
    };
  }

  getStateAbbreviation(state: string): string {
    return statesElectionData.find((d) => d.location === state).locationAbbrev;
  }
}
