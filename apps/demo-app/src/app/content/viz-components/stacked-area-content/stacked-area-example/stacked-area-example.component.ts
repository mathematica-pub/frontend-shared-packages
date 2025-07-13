import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ChartConfig,
  ElementSpacing,
  HoverMoveAction,
  HtmlTooltipConfig,
  StackedAreaConfig,
  StackedAreaHost,
  StackedAreaHoverMoveEmitTooltipData,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicStackedAreaConfigBuilder,
  VicStackedAreaModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { IndustryUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { StackedAreaInteractionOutput } from 'dist/viz-components/lib/stacked-area/events/stacked-area-interaction-output';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: StackedAreaConfig<IndustryUnemploymentDatum, string>;
  xAxisConfig: VicXQuantitativeAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-area-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicStackedAreaModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
  ],
  templateUrl: './stacked-area-example.component.html',
  styleUrls: ['./stacked-area-example.component.scss'],
  providers: [
    VicChartConfigBuilder,
    VicStackedAreaConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class StackedAreaExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 12,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-area-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<
    StackedAreaInteractionOutput<IndustryUnemploymentDatum, string>
  > = new BehaviorSubject<
    StackedAreaInteractionOutput<IndustryUnemploymentDatum, string>
  >(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverMoveActions: HoverMoveAction<
    StackedAreaHost<IndustryUnemploymentDatum, string>
  >[] = [new StackedAreaHoverMoveEmitTooltipData()];

  constructor(
    private dataService: DataService,
    private chart: VicChartConfigBuilder,
    private stackedArea: VicStackedAreaConfigBuilder<
      IndustryUnemploymentDatum,
      string
    >,
    private xAxisQuantitative: VicXQuantitativeAxisConfigBuilder<Date>,
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
    const chartConfig = this.chart.margin(this.margin).getConfig();
    const xAxisConfig = this.xAxisQuantitative
      .ticks((ticks) => ticks.format('%Y'))
      .getConfig();
    const yAxisConfig = this.yAxisQuantitative
      .ticks((ticks) => ticks.format(',.0f'))
      .getConfig();
    const dataConfig = this.stackedArea
      .data(data)
      .xDate((dimension) => dimension.valueAccessor((d) => d.date))
      .y((dimension) => dimension.valueAccessor((d) => d.value))
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
    output: StackedAreaInteractionOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.updateTooltipData(output);
    this.updateTooltipConfig(output);
  }

  updateTooltipData(
    output: StackedAreaInteractionOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(output);
  }

  updateTooltipConfig(
    output: StackedAreaInteractionOutput<IndustryUnemploymentDatum, string>
  ): void {
    const config = this.tooltip
      .size((size) => size.minWidth(130))
      .positionFromOutput(output)
      .show(output?.hoveredAreaDatum !== undefined)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
