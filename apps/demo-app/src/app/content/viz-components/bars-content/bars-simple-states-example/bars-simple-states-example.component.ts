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
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import {
  LocationCategoryDatum,
  statesElectionData,
} from '../../data/location-category-data';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: BarsConfig<LocationCategoryDatum, string>;
  ordinalAxisConfig: VicOrdinalAxisConfig<string>;
  quantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-bars-simple-states-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
    VicYOrdinalAxisModule,
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
    let ordinalAxisConfig: VicOrdinalAxisConfig<string>;
    let quantitativeAxisConfig: VicQuantitativeAxisConfig<number>;

    const chartConfig = this.chart
      .margin(this.margin)
      .height(this.height)
      .width(this.width)
      .resize({ height: false })
      .getConfig();

    if (this.orientation === 'horizontal') {
      ordinalAxisConfig = this.yOrdinalAxis.removeTickMarks().getConfig();
      quantitativeAxisConfig = this.xQuantitativeAxis
        .tickFormat('.0%')
        .numTicks(5)
        .label((label) =>
          label.text('Percentage of Population').offset({ y: 12 })
        )
        .getConfig();
    } else {
      ordinalAxisConfig = this.xOrdinalAxis
        .removeTickMarks()
        .tickFormat((state) => this.getStateAbbreviation(state))
        .getConfig();
      quantitativeAxisConfig = this.yQuantitativeAxis
        .tickFormat('.0%')
        .numTicks(5)
        .label((label) => label.text('Percentage of Population'))
        .getConfig();
    }

    const dataConfig = this.bars
      .data(
        statesElectionData
          .filter((d) => d.category === 'D')
          .slice()
          .sort((a, b) => b.value - a.value)
      )
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
