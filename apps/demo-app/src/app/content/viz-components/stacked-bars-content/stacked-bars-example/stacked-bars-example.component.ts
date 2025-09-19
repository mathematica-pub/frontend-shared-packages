import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ChartConfig,
  ElementSpacing,
  EventAction,
  EventType,
  HoverMoveAction,
  HtmlTooltipConfig,
  StackedBarsClickEmitTooltipDataPauseOtherActions,
  StackedBarsConfig,
  StackedBarsHost,
  StackedBarsHoverMoveEmitTooltipData,
  StackedBarsInteractionOutput,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { IndustryUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { BehaviorSubject, Observable, Subject, filter, map } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: StackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: VicXOrdinalAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-bars-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicStackedBarsModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
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
  hoverMoveActions: HoverMoveAction<
    StackedBarsHost<IndustryUnemploymentDatum, string>,
    StackedBarsInteractionOutput<IndustryUnemploymentDatum>
  >[] = [new StackedBarsHoverMoveEmitTooltipData()];
  clickActions: EventAction<
    StackedBarsHost<IndustryUnemploymentDatum, string>,
    StackedBarsInteractionOutput<IndustryUnemploymentDatum>
  >[] = [new StackedBarsClickEmitTooltipDataPauseOtherActions()];
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  interactionOutput: BehaviorSubject<
    StackedBarsInteractionOutput<IndustryUnemploymentDatum>
  > = new BehaviorSubject<
    StackedBarsInteractionOutput<IndustryUnemploymentDatum>
  >(null);
  interactionOutput$ = this.interactionOutput.asObservable();
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
    const xAxisConfig = this.xAxisOrdinal
      .ticks((ticks) => ticks.format('%Y'))
      .getConfig();
    const yAxisConfig = this.yAxisQuantitative
      .ticks((ticks) => ticks.format(',.0f'))
      .getConfig();
    const dataConfig = this.stackedBars
      .data(yearlyData)
      .vertical((bars) =>
        bars
          .x((dimension) =>
            dimension
              .valueAccessor((d) => d.date)
              .formatFunction((d) => d.date.getFullYear().toString())
          )
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
    data: StackedBarsInteractionOutput<IndustryUnemploymentDatum>
  ): void {
    this.interactionOutput.next(data);
    this.updateTooltipConfig(data?.type);
  }

  updateTooltipConfig(eventType: EventType | undefined): void {
    const data = this.interactionOutput.getValue();
    const config = this.tooltip
      .positionFromOutput(data)
      .hasBackdrop(eventType === 'click')
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }

  onBackdropClick(): void {
    this.removeTooltipEvent.next();
    this.updateTooltipConfig(EventType.Hover);
  }
}
