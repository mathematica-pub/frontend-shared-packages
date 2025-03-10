import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ChartConfig,
  ElementSpacing,
  HoverMoveAction,
  HtmlTooltipConfig,
  StackedAreaConfig,
  StackedAreaEventOutput,
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicQuantitativeAxisConfig,
  VicStackedAreaConfigBuilder,
  VicStackedAreaModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { IndustryUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: StackedAreaConfig<IndustryUnemploymentDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-area-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicXyChartModule,
    VicStackedAreaModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
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
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-area-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<
    StackedAreaEventOutput<IndustryUnemploymentDatum, string>
  > = new BehaviorSubject<
    StackedAreaEventOutput<IndustryUnemploymentDatum, string>
  >(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    StackedAreaHoverMoveDirective<IndustryUnemploymentDatum, string>
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
    const xAxisConfig = this.xAxisQuantitative.tickFormat('%Y').getConfig();
    const yAxisConfig = this.yAxisQuantitative.tickFormat(',.0f').getConfig();
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
    data: StackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(
    data: StackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: StackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    const config = this.tooltip
      .size((size) => size.minWidth(130))
      .stackedAreaPosition([
        {
          offsetX: data?.positionX,
          offsetY: data ? data.hoveredAreaTop - 8 : undefined,
        },
      ])
      .show(data?.hoveredDatum !== undefined)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
