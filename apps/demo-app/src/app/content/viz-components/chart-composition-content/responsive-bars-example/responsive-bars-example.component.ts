import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
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
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { WeatherDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { format } from 'd3';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

interface ViewModel {
  chartConfig: (i: number) => ChartConfig;
  dataConfig: BarsConfig<WeatherDatum, string, Date>;
  xAxisConfig: VicOrdinalAxisConfig<Date> | VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<Date> | VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-responsive-bars-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXOrdinalAxisModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    VicHtmlTooltipModule,
  ],
  templateUrl: './responsive-bars-example.component.html',
  styleUrl: './responsive-bars-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class ResponsiveBarsExampleComponent implements OnInit {
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
  chartMultiples = ['Seattle', 'New York'];

  constructor(
    private dataService: DataService,
    private bars: VicBarsConfigBuilder<WeatherDatum, string, Date>,
    private chart: VicChartConfigBuilder,
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
      (d) =>
        d.date.getFullYear() === 2012 &&
        d.date.getDate() === 1 &&
        d.location === 'Seattle'
    );

    this.chart.resize({
      height: false,
      width: false,
    });

    const xAxisConfig = this.xQuantitativeAxis
      .side('top')
      .tickFormat('.0f')
      .getConfig();
    const yAxisConfig = this.yOrdinalAxis
      .removeTickMarks()
      .tickFormat('%B %Y')
      .getConfig();

    const dataConfig = this.bars
      .data(filteredData)
      .multiples((dimension) => dimension.valueAccessor((d) => d.date))
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
              .valueAccessor(() => '')
              .paddingInner(0)
              .paddingOuter(0.05)
          )
      )
      .color((dimension) => dimension.range(['darkgreen']))
      .backgrounds((backgrounds) => backgrounds.color('thistle'))
      .labels((labels) => labels.display(true))
      .getConfig();

    return {
      chartConfig: (i: number) => this.getChartConfig(i),
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  getChartConfig(i: number): ChartConfig {
    const margin = {
      top: 36,
      right: 0,
      bottom: 0,
      left: 0,
    };
    let height = 36 + margin.top;
    if (i !== 0) {
      margin.top = 0;
      height = 36;
    }
    return this.chart.width(240).height(height).margin(margin).getConfig();
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
}
