import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { format } from 'd3';
import { VicOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/ordinal/ordinal-axis-config';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis-config';
import { BarsConfig } from 'projects/viz-components/src/lib/bars/config/bars-config';
import { BarsEventOutput } from 'projects/viz-components/src/lib/bars/events/bars-event-output';
import { ElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { HoverMoveAction } from 'projects/viz-components/src/lib/events/action';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/tooltips/html-tooltip/config/html-tooltip-config';
import {
  BarsHoverMoveDirective,
  BarsHoverMoveEmitTooltipData,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
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
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DataService } from '../../../core/services/data.service';

export interface MetroUnemploymentDatum {
  division: string;
  date: Date;
  value: number;
}

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
  selector: 'app-bars',
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
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    VicBarsConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
    DataService<MetroUnemploymentDatum>,
  ],
})
export class BarsComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 0,
    bottom: 8,
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
    private dataService: DataService<MetroUnemploymentDatum>,
    private bars: VicBarsConfigBuilder<MetroUnemploymentDatum, string>,
    private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    this.dataService.initJsonData('../metro_unemployment.json');

    this.vm$ = this.dataService.data$.pipe(
      map((data) => this.getViewModel(data))
    );
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
    );
    const xAxisConfig = this.xQuantitativeAxis.tickFormat('.0f').getConfig();
    const yAxisConfig = this.yQuantitativeAxis.tickFormat('.0f').getConfig();

    const dataConfig = this.bars
      .data(filteredData)
      .orientation('horizontal')
      .createQuantitativeDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.value)
          .formatFunction((d) => this.getQuantitativeValueFormat(d))
          .domainPaddingPixels()
      )
      .createCategoricalDimension((dimension) => dimension.range(['slategray']))
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.division)
      )
      .createLabels((labels) => labels.display(true))
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
      .createOffsetFromOriginPosition((position) =>
        position
          .offsetX(data?.positionX)
          .offsetY(data ? data.positionY - 4 : undefined)
      )
      .origin(data ? data.elRef : undefined)
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
