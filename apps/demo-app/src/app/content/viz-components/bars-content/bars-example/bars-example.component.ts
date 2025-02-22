import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  BarsConfig,
  BarsEventOutput,
  BarsHoverMoveDirective,
  BarsHoverMoveEmitTooltipData,
  ElementSpacing,
  HoverMoveAction,
  HtmlTooltipConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
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
  dataConfig: BarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig: VicOrdinalAxisConfig<string> | VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string> | VicQuantitativeAxisConfig<number>;
}

enum Orientation {
  vertical = 'vertical',
  horizontal = 'horizontal',
}
@Component({
  selector: 'app-bars-example',
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
  templateUrl: './bars-example.component.html',
  styleUrls: ['./bars-example.component.scss'],
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
export class BarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 0,
    bottom: 32,
    left: 300,
  };
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
  orientation: BehaviorSubject<keyof typeof Orientation> = new BehaviorSubject(
    Orientation.horizontal as keyof typeof Orientation
  );
  orientation$ = this.orientation.asObservable();

  constructor(
    private dataService: DataService,
    private bars: VicBarsConfigBuilder<MetroUnemploymentDatum, string>,
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

    this.vm$ = combineLatest([data$, this.orientation$]).pipe(
      map(([data, orientation]) => this.getViewModel(data, orientation))
    );
  }

  getViewModel(
    data: MetroUnemploymentDatum[],
    orientation: 'horizontal' | 'vertical'
  ): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
    );

    const xAxisConfig =
      orientation === Orientation.horizontal
        ? this.xQuantitativeAxis.side('top').tickFormat('.0f').getConfig()
        : this.xOrdinalAxis
            .removeTickMarks()
            .removeDomainLine('never')
            .getConfig();
    const yAxisConfig =
      orientation === Orientation.horizontal
        ? this.yOrdinalAxis.removeTickMarks().getConfig()
        : this.yQuantitativeAxis.tickFormat('.0f').getConfig();

    const dataConfig = this.bars
      .data(filteredData)
      .horizontal(
        orientation === Orientation.horizontal
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
        orientation === Orientation.vertical
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

  changeMargin(): void {
    this.margin = {
      top: 36,
      right: 0,
      bottom: 8,
      left: Math.random() * 500,
    };
  }

  updateOrientation(value: keyof typeof Orientation): void {
    this.orientation.next(value);
    this.updateMargin(value);
  }

  updateMargin(orientation: keyof typeof Orientation): void {
    this.margin = {
      top: 36,
      right: 0,
      bottom: 8,
      left: orientation === Orientation.horizontal ? 300 : 36,
    };
  }
}
