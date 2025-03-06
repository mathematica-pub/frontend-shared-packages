import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  BarsConfig,
  BarsEventOutput,
  BarsHoverMoveDirective,
  BarsHoverMoveEmitTooltipData,
  ChartConfig,
  HoverMoveAction,
  HtmlTooltipConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicOrdinalAxisConfig,
  VicQuantitativeAxisConfig,
  VicSharedContextModule,
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
import { WeatherDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { format, utcFormat } from 'd3';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

interface ViewModel {
  chartConfigLeft: ChartConfig;
  chartConfigOther: ChartConfig;
  dataConfig: BarsConfig<WeatherDatum, Date, string>;
  xAxisConfig: VicOrdinalAxisConfig<Date> | VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<Date> | VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-small-multiples-bars-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicSharedContextModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXOrdinalAxisModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    VicHtmlTooltipModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  templateUrl: './small-multiples-bars-example.component.html',
  styleUrls: ['./small-multiples-bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    VicBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class SmallMultiplesBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  folderName = 'small-multiples-bars-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<WeatherDatum, string>> =
    new BehaviorSubject<BarsEventOutput<WeatherDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    BarsHoverMoveDirective<WeatherDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];
  leftChartMargin = {
    top: 20,
    right: 0,
    bottom: 0,
    left: 72,
  };
  otherChartMarginLeft = 12;
  chartWidth = 240;
  chartHeight = 300;

  constructor(
    private dataService: DataService,
    private bars: VicBarsConfigBuilder<WeatherDatum, Date, string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<Date>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.weatherData$
      .pipe(filter((x) => !!x))
      .pipe(map((data) => this.getViewModel(data)));
  }

  getViewModel(data: WeatherDatum[]): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2012 && d.date.getDate() === 1
    );

    const xAxisConfig = this.xQuantitativeAxis
      .side('top')
      .tickFormat('.0f')
      .numTicks(5)
      .getConfig();

    const yAxisConfig = this.yOrdinalAxis
      .removeTickMarks()
      .tickFormat('%B %Y')
      .getConfig();

    const dataConfig = this.bars
      .data(filteredData)
      .multiples((dimension) => dimension.valueAccessor((d) => d.location))
      .horizontal((bars) =>
        bars
          .x((dimension) =>
            dimension
              .valueAccessor((d) => d.tempMax)
              .formatFunction((d) => this.getQuantitativeValueFormat(d))
              .domainPaddingPixels()
          )
          .y((dimension) =>
            dimension
              .valueAccessor((d) => d.date)
              .formatFunction((d) => utcFormat('%B %Y')(d?.date))
          )
      )
      .color((dimension) => dimension.range(['darkgreen']))
      .backgrounds((backgrounds) => backgrounds.color('thistle').events(true))
      .labels((labels) => labels.display(true))
      .getConfig();

    return {
      chartConfigLeft: this.getLeftChartConfig(),
      chartConfigOther: this.getOtherChartConfig(),
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  getLeftChartConfig(): ChartConfig {
    return new VicChartConfigBuilder()
      .width(this.chartWidth)
      .height(this.chartHeight)
      .margin(this.leftChartMargin)
      .resize({ width: false, height: false })
      .getConfig();
  }

  getOtherChartConfig(): ChartConfig {
    return new VicChartConfigBuilder()
      .width(
        this.chartWidth - this.leftChartMargin.left + this.otherChartMarginLeft
      )
      .height(this.chartHeight)
      .margin({
        ...this.leftChartMargin,
        left: this.otherChartMarginLeft,
      })
      .resize({ width: false, height: false })
      .getConfig();
  }

  getQuantitativeValueFormat(d: WeatherDatum): string {
    const label =
      d.tempMax === undefined || d.tempMax === null
        ? 'N/A'
        : format('.1f')(d.tempMax);
    return label;
  }

  updateTooltipForNewOutput(data: BarsEventOutput<WeatherDatum, string>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput<WeatherDatum, string>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput<WeatherDatum, string>): void {
    console.log(data);
    const config = this.tooltip
      .barsPosition(data?.origin, [
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - 12 : undefined,
        },
      ])
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
