import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DotsConfig,
  DotsEventOutput,
  DotsHoverMoveDefaultStyles,
  DotsHoverMoveDirective,
  DotsHoverMoveEmitTooltipData,
  ElementSpacing,
  HoverMoveAction,
  HtmlTooltipConfig,
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
    VicDotsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class DotsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 0,
    bottom: 8,
    left: 60,
  };
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
    const xAxisConfig = this.xQuantitativeAxis.tickFormat('.1f').getConfig();
    const yAxisConfig = this.yQuantitativeAxis.tickFormat('.1f').getConfig();

    const dataConfig = this.dots
      .data(data.filter((x) => x.date.getFullYear() === 2012))
      .fillOrdinal((dimension) =>
        dimension.valueAccessor((d) => d.location).range(['#2cafb0', '#a560cc'])
      )
      .radiusNumber((dimension) =>
        dimension.valueAccessor((d) => d.wind).range([2, 8])
      )
      .x((dimension) => dimension.valueAccessor((d) => d.tempMax))
      .y((dimension) => dimension.valueAccessor((d) => d.precipitation))
      .getConfig();

    return {
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
    console.log(data?.positionX, data?.positionY);
    const config = this.tooltip
      .origin(data?.elRef || undefined)
      .createOffsetFromOriginPosition((position) =>
        position.offsetX(data?.positionX).offsetY(data?.positionY)
      )
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
