import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  BarsEventOutput,
  ChartConfig,
  ElementSpacing,
  EventAction,
  HoverMoveAction,
  HtmlTooltipConfig,
  StackedBarsClickDirective,
  StackedBarsClickEmitTooltipDataPauseHoverMoveActions,
  StackedBarsConfig,
  StackedBarsHoverMoveDirective,
  StackedBarsHoverMoveEmitTooltipData,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
  XOrdinalAxisConfig,
  YQuantitativeAxisConfig,
} from '@hsi/viz-components';
import { IndustryUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { BehaviorSubject, Observable, Subject, filter, map } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: StackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: XOrdinalAxisConfig<Date>;
  yAxisConfig: YQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-bars-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicStackedBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
    VicHtmlTooltipModule,
  ],
  templateUrl: './stacked-bars-example.component.html',
  styleUrls: ['./stacked-bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    VicChartConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class StackedBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-bars-example';
  hoverAndMoveActions: HoverMoveAction<
    StackedBarsHoverMoveDirective<IndustryUnemploymentDatum, string>
  >[] = [new StackedBarsHoverMoveEmitTooltipData()];
  clickActions: EventAction<
    StackedBarsClickDirective<IndustryUnemploymentDatum, string>
  >[] = [new StackedBarsClickEmitTooltipDataPauseHoverMoveActions()];
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<
    BarsEventOutput<IndustryUnemploymentDatum, string>
  > = new BehaviorSubject<BarsEventOutput<IndustryUnemploymentDatum, string>>(
    null
  );
  tooltipData$ = this.tooltipData.asObservable();
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();

  constructor(
    private dataService: DataService,
    private chart: VicChartConfigBuilder,
    private stackedBars: VicStackedBarsConfigBuilder<
      IndustryUnemploymentDatum,
      Date
    >,
    private xAxisOrdinal: VicXOrdinalAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const yearlyData = data.filter(
      (d) => d.date.getUTCDate() === 1 && d.date.getUTCMonth() === 0
    );
    const chartConfig = this.chart
      .margin({
        top: 8,
        right: 0,
        bottom: 36,
        left: 64,
      })
      .getConfig();
    const xAxisConfig = this.xAxisOrdinal.tickFormat('%Y').getConfig();
    const yAxisConfig = this.yAxisQuantitative.tickFormat(',.0f').getConfig();
    const dataConfig = this.stackedBars
      .data(yearlyData)
      .vertical((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.date))
          .y((dimension) => dimension.valueAccessor((d) => d.value))
      )
      .color((dimension) => dimension.valueAccessor((d) => d.industry))
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(
    data: BarsEventOutput<IndustryUnemploymentDatum, string>,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(tooltipEvent);
  }

  updateTooltipData(
    data: BarsEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(tooltipEvent): void {
    const data = this.tooltipData.getValue();
    const config = this.tooltip
      .barsPosition(data?.origin, [
        {
          offsetX: data?.positionX,
          offsetY: data?.positionY - 12,
        },
      ])
      .hasBackdrop(tooltipEvent === 'click')
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }

  onBackdropClick(): void {
    this.removeTooltipEvent.next();
    this.updateTooltipConfig('hover');
  }
}
