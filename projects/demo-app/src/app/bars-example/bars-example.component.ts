import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { format } from 'd3';
import { VicOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/ordinal/ordinal-axis-config';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis-config';
import { BarsConfig } from 'projects/viz-components/src/lib/bars/config/bars-config';
import { BarsEventOutput } from 'projects/viz-components/src/lib/bars/events/bars-event-output';
import { ElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { HoverMoveEventEffect } from 'projects/viz-components/src/lib/events/effect';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/tooltips/html-tooltip/config/html-tooltip-config';
import {
  BarsHoverMoveDirective,
  BarsHoverMoveEmitTooltipData,
  VicBarsBuilder,
  VicHtmlTooltipBuilder,
  VicXOrdinalAxisBuilder,
  VicXQuantitativeAxisBuilder,
  VicYOrdinalAxisBuilder,
  VicYQuantitativeAxisBuilder,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

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
  templateUrl: './bars-example.component.html',
  styleUrls: ['./bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    VicBarsBuilder,
    VicXOrdinalAxisBuilder,
    VicXQuantitativeAxisBuilder,
    VicYOrdinalAxisBuilder,
    VicYQuantitativeAxisBuilder,
    VicHtmlTooltipBuilder,
  ],
})
export class BarsExampleComponent implements OnInit {
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
  hoverAndMoveEffects: HoverMoveEventEffect<
    BarsHoverMoveDirective<MetroUnemploymentDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];
  orientation: BehaviorSubject<keyof typeof Orientation> = new BehaviorSubject(
    Orientation.horizontal as keyof typeof Orientation
  );
  orientation$ = this.orientation.asObservable();

  constructor(
    private dataService: DataService,
    private bars: VicBarsBuilder<MetroUnemploymentDatum, string>,
    private xOrdinalAxis: VicXOrdinalAxisBuilder<string>,
    private xQuantitativeAxis: VicXQuantitativeAxisBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisBuilder<string>,
    private yQuantitativeAxis: VicYQuantitativeAxisBuilder<number>,
    private tooltip: VicHtmlTooltipBuilder
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
        ? this.xQuantitativeAxis.tickFormat('.0f').build()
        : this.xOrdinalAxis.build();
    const yAxisConfig =
      orientation === Orientation.horizontal
        ? this.yOrdinalAxis.build()
        : this.yQuantitativeAxis.tickFormat('.0f').build();

    const dataConfig = this.bars
      .data(filteredData)
      .orientation(orientation)
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
      .build();

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
      .build();
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
  }
}
