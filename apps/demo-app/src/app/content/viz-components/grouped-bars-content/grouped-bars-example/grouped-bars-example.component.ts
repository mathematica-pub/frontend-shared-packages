import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  BarsHoverMoveEmitTooltipData,
  ChartConfig,
  ElementSpacing,
  GroupedBarsConfig,
  GroupedBarsHost,
  GroupedBarsInteractionOutput,
  HoverMoveAction,
  HtmlTooltipConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicGroupedBarsConfigBuilder,
  VicGroupedBarsModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@mathstack/viz';
import {
  IndustryUnemploymentDatum,
  MetroUnemploymentDatum,
} from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: GroupedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: VicXOrdinalAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-grouped-bars-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicGroupedBarsModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
  ],
  providers: [
    VicChartConfigBuilder,
    VicGroupedBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
  templateUrl: './grouped-bars-example.component.html',
  styleUrl: './grouped-bars-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GroupedBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  folderName = 'stacked-bars-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  interactionOutput: BehaviorSubject<
    GroupedBarsInteractionOutput<MetroUnemploymentDatum>
  > = new BehaviorSubject<GroupedBarsInteractionOutput<MetroUnemploymentDatum>>(
    null
  );
  tooltipData$ = this.interactionOutput.asObservable();
  hoverMoveActions: HoverMoveAction<
    GroupedBarsHost<MetroUnemploymentDatum, Date>,
    GroupedBarsInteractionOutput<MetroUnemploymentDatum>
  >[] = [new BarsHoverMoveEmitTooltipData()];
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };

  constructor(
    private dataService: DataService,
    private chart: VicChartConfigBuilder,
    private groupedBars: VicGroupedBarsConfigBuilder<
      IndustryUnemploymentDatum,
      Date
    >,
    private xAxisOrdinal: VicXOrdinalAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) { }

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
    const filteredIndustryData = yearlyData.filter(
      (d) => d.industry === 'Government' || d.industry === 'Finance'
    );
    const chartConfig = this.chart
      .margin(this.margin)
      .scalingStrategy('responsive-width')
      .getConfig();
    const xAxisConfig = this.xAxisOrdinal
      .ticks((ticks) => ticks.format('%Y'))
      .getConfig();
    const yAxisConfig = this.yAxisQuantitative
      .ticks((ticks) => ticks.format(',.0f'))
      .getConfig();
    const dataConfig = this.groupedBars
      .data(filteredIndustryData)
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
    output: GroupedBarsInteractionOutput<MetroUnemploymentDatum> | null
  ): void {
    this.interactionOutput.next(output);
    this.updateTooltipConfig(output);
  }

  updateTooltipConfig(
    output: GroupedBarsInteractionOutput<MetroUnemploymentDatum> | null
  ): void {
    const config = this.tooltip
      .positionFromOutput(output)
      .show(!!output)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
