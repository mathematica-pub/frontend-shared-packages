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
import { MetroUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { format } from 'd3';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: BarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig: VicOrdinalAxisConfig<string> | VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string> | VicQuantitativeAxisConfig<number>;
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
  selector: 'app-bars-example',
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
  templateUrl: './bars-example.component.html',
  styleUrls: ['./bars-example.component.scss'],
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
export class BarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  folderName = 'bars-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<
    BarsEventOutput<MetroUnemploymentDatum, string>
  > = new BehaviorSubject<BarsEventOutput<MetroUnemploymentDatum, string>>(
    null
  );
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    BarsHoverMoveDirective<MetroUnemploymentDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];
  layoutProperties: BehaviorSubject<LayoutProperties> =
    new BehaviorSubject<LayoutProperties>({
      orientation: Orientation.horizontal,
      margin: {
        top: 36,
        right: 0,
        bottom: 32,
        left: 300,
      },
    });
  layoutProperties$ = this.layoutProperties.asObservable();

  constructor(
    private dataService: DataService,
    private bars: VicBarsConfigBuilder<MetroUnemploymentDatum, string>,
    private chart: VicChartConfigBuilder,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    const data$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x)
    );

    this.vm$ = combineLatest([data$, this.layoutProperties$]).pipe(
      map(([data, layoutProperties]) =>
        this.getViewModel(data, layoutProperties)
      )
    );
  }

  getViewModel(
    data: MetroUnemploymentDatum[],
    layout: LayoutProperties
  ): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
    );

    const chartConfig = this.chart
      .margin(layout.margin)
      .width(layout.orientation === 'horizontal' ? 800 : 960)
      .height(layout.orientation === 'horizontal' ? 800 : 500)
      .resize({
        height: false,
        width: true,
      })
      .getConfig();

    const xAxisConfig =
      layout.orientation === Orientation.horizontal
        ? this.xQuantitativeAxis.side('top').tickFormat('.0f').getConfig()
        : this.xOrdinalAxis.removeTickMarks().rotateTickLabels(30).getConfig();
    const yAxisConfig =
      layout.orientation === Orientation.horizontal
        ? this.yOrdinalAxis.removeTickMarks().getConfig()
        : this.yQuantitativeAxis.tickFormat('.0f').getConfig();

    const dataConfig = this.bars
      .data(filteredData)
      .horizontal(
        layout.orientation === Orientation.horizontal
          ? (bars) =>
              bars
                .x((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .formatFunction((d) => this.getQuantitativeValueFormat(d))
                    .domainPaddingPixels()
                )
                .y((dimension) => dimension.valueAccessor((d) => d.division))
          : null
      )
      .vertical(
        layout.orientation === Orientation.vertical
          ? (bars) =>
              bars
                .x((dimension) => dimension.valueAccessor((d) => d.division))
                .y((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .formatFunction((d) => this.getQuantitativeValueFormat(d))
                    .domainPaddingPixels()
                )
          : null
      )
      .color((dimension) => dimension.range(['slategray']))
      .backgrounds((backgrounds) => backgrounds.color('linen'))
      .labels((labels) => labels.display(true))
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  getQuantitativeValueFormat(d: MetroUnemploymentDatum): string {
    const label =
      d.value === undefined || d.value === null
        ? 'N/A'
        : format('.1f')(d.value);
    return d.value > 8 ? `${label}*` : label;
  }

  updateTooltipForNewOutput(
    data: BarsEventOutput<MetroUnemploymentDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(
    data: BarsEventOutput<MetroUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: BarsEventOutput<MetroUnemploymentDatum, string>
  ): void {
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
        left: value === Orientation.horizontal ? 300 : 160,
      },
    });
  }
}
