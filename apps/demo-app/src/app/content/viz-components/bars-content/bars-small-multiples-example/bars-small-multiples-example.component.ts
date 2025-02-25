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
  ElementSpacing,
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
import { format } from 'd3';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: BarsConfig<WeatherDatum, Date>;
  xAxisConfig: VicOrdinalAxisConfig<Date> | VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<Date> | VicQuantitativeAxisConfig<number>;
}

enum Orientation {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

interface LayoutProperties {
  orientation: Orientation;
  margin: ElementSpacing;
}
@Component({
  selector: 'app-bars-small-multiples-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
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
  templateUrl: './bars-small-multiples-example.component.html',
  styleUrls: ['./bars-small-multiples-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    VicChartConfigBuilder,
    VicBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class BarsSmallMultiplesExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  folderName = 'bars-smll-multiples-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<WeatherDatum, string>> =
    new BehaviorSubject<BarsEventOutput<WeatherDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    BarsHoverMoveDirective<WeatherDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];
  layoutProperties: BehaviorSubject<LayoutProperties> =
    new BehaviorSubject<LayoutProperties>({
      orientation: Orientation.horizontal,
      margin: {
        top: 24,
        right: 0,
        bottom: 32,
        left: 160,
      },
    });
  layoutProperties$ = this.layoutProperties.asObservable();
  chartMultiples = ['Seattle', 'New York'];

  constructor(
    private dataService: DataService,
    private bars: VicBarsConfigBuilder<WeatherDatum, Date>,
    private chart: VicChartConfigBuilder,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<Date>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<Date>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    const data$ = this.dataService.weatherData$.pipe(filter((x) => !!x));

    this.vm$ = combineLatest([data$, this.layoutProperties$]).pipe(
      map(([data, layoutProperties]) =>
        this.getViewModel(data, layoutProperties)
      )
    );
  }

  getViewModel(data: WeatherDatum[], layout: LayoutProperties): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2012 && d.date.getDate() === 1
    );

    const chartConfig = this.chart
      .margin(layout.margin)
      .width(layout.orientation === 'horizontal' ? 400 : 300)
      .height(layout.orientation === 'horizontal' ? 300 : 400)
      // .multiples((multiples) => multiples.valueAccessor((d) => d.location))
      .resize({
        height: false,
        width: false,
      })
      .getConfig();

    console.log('chartConfig', chartConfig);

    const xAxisConfig =
      layout.orientation === Orientation.horizontal
        ? this.xQuantitativeAxis.side('top').tickFormat('.0f').getConfig()
        : this.xOrdinalAxis
            .removeTickMarks()
            .removeDomainLine('never')
            .rotateTickLabels(30)
            .tickFormat('%B %Y')
            .getConfig();
    const yAxisConfig =
      layout.orientation === Orientation.horizontal
        ? this.yOrdinalAxis.removeTickMarks().tickFormat('%B %Y').getConfig()
        : this.yQuantitativeAxis.tickFormat('.0f').getConfig();

    const dataConfig = this.bars
      .data(filteredData)
      .multiples((dimension) =>
        dimension.valueAccessor((d) => d.location).domain(this.chartMultiples)
      )
      .horizontal(
        layout.orientation === Orientation.horizontal
          ? (bars) =>
              bars
                .x((dimension) =>
                  dimension
                    .valueAccessor((d) => d.tempMax)
                    .formatFunction((d) => this.getQuantitativeValueFormat(d))
                    .domainPaddingPixels()
                )
                .y((dimension) => dimension.valueAccessor((d) => d.date))
          : null
      )
      .vertical(
        layout.orientation === Orientation.vertical
          ? (bars) =>
              bars
                .x((dimension) => dimension.valueAccessor((d) => d.date))
                .y((dimension) =>
                  dimension
                    .valueAccessor((d) => d.wind)
                    .formatFunction((d) => this.getQuantitativeValueFormat(d))
                    .domainPaddingPixels()
                )
          : null
      )
      .color((dimension) => dimension.range(['darkgreen']))
      .backgrounds((backgrounds) => backgrounds.color('thistle'))
      .labels((labels) => labels.display(true))
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
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

  updateOrientation(value: Orientation): void {
    this.layoutProperties.next({
      orientation: value,
      margin: {
        top: 36,
        right: 0,
        bottom: value === Orientation.horizontal ? 32 : 200,
        left: value === Orientation.horizontal ? 160 : 160,
      },
    });
  }
}
