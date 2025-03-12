import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ChartConfig,
  DotsConfig,
  DotsEventOutput,
  DotsHoverMoveDefaultStyles,
  DotsHoverMoveDirective,
  DotsHoverMoveEmitTooltipData,
  HoverMoveAction,
  HtmlTooltipConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { WeatherDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { BehaviorSubject, map, Observable } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: DotsConfig<WeatherDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-dots-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicDotsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
    VicHtmlTooltipModule,
  ],
  templateUrl: './dots-example.component.html',
  styleUrl: './dots-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicChartConfigBuilder,
    VicDotsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class DotsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<DotsEventOutput<WeatherDatum>> =
    new BehaviorSubject<DotsEventOutput<WeatherDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: HoverMoveAction<DotsHoverMoveDirective<WeatherDatum>>[] = [
    new DotsHoverMoveDefaultStyles(),
    new DotsHoverMoveEmitTooltipData(),
  ];

  constructor(
    private dataService: DataService,
    private chart: VicChartConfigBuilder,
    private dots: VicDotsConfigBuilder<WeatherDatum>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.weatherData$.pipe(
      map((data) => this.getViewModel(data))
    );
  }

  getViewModel(data: WeatherDatum[]): ViewModel {
    const chartConfig = this.chart
      .margin({
        top: 36,
        right: 0,
        bottom: 8,
        left: 60,
      })
      .resize({
        height: false,
      })
      .getConfig();

    const xAxisConfig = this.xQuantitativeAxis.tickFormat('.1f').getConfig();
    const yAxisConfig = this.yQuantitativeAxis
      .tickFormat('.1f')
      .zeroAxis({ useZeroAxis: false })
      .getConfig();

    const dataConfig = this.dots
      .data(data.filter((x) => x.date.getFullYear() === 2012))
      .fillCategorical((fillCategorical) =>
        fillCategorical
          .valueAccessor((d) => d.location)
          .range(['#2cafb0', '#a560cc'])
      )
      .radiusNumeric((radiusNumeric) =>
        radiusNumeric.valueAccessor((d) => d.wind).range([2, 8])
      )
      .xNumeric((xNumeric) => xNumeric.valueAccessor((d) => d.tempMax))
      .yNumeric((yNumeric) => yNumeric.valueAccessor((d) => d.precipitation))
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(data: DotsEventOutput<WeatherDatum>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: DotsEventOutput<WeatherDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: DotsEventOutput<WeatherDatum>): void {
    const config = this.tooltip
      .dotsPosition(data?.origin, [
        {
          offsetY: data ? data.positionY - 12 : undefined,
          offsetX: data?.positionX,
        },
      ])
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
