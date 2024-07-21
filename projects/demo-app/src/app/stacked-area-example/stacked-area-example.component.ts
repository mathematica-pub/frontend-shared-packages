import { Component, OnInit } from '@angular/core';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis-config';
import { ElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { HoverMoveEventEffect } from 'projects/viz-components/src/lib/events/effect';
import { StackedAreaConfig } from 'projects/viz-components/src/lib/stacked-area/config/stacked-area-config';
import { VicHtmlTooltipBuilder } from 'projects/viz-components/src/lib/tooltips/html-tooltip/config/html-tooltip-builder';
import {
  HtmlTooltipConfig,
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
  VicStackedAreaBuilder,
  VicStackedAreaEventOutput,
  VicXQuantitativeAxisBuilder,
  VicYQuantitativeAxisBuilder,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: StackedAreaConfig<IndustryUnemploymentDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-area-example',
  templateUrl: './stacked-area-example.component.html',
  styleUrls: ['./stacked-area-example.component.scss'],
  providers: [
    VicStackedAreaBuilder,
    VicXQuantitativeAxisBuilder,
    VicYQuantitativeAxisBuilder,
    VicHtmlTooltipBuilder,
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
    VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  > = new BehaviorSubject<
    VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  >(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveEffects: HoverMoveEventEffect<
    StackedAreaHoverMoveDirective<IndustryUnemploymentDatum, string>
  >[] = [new StackedAreaHoverMoveEmitTooltipData()];

  constructor(
    private dataService: DataService,
    private stackedArea: VicStackedAreaBuilder<
      IndustryUnemploymentDatum,
      string
    >,
    private xAxisQuantitative: VicXQuantitativeAxisBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisBuilder<number>,
    private tooltip: VicHtmlTooltipBuilder
  ) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const xAxisConfig = this.xAxisQuantitative.tickFormat('%Y').build();
    const yAxisConfig = this.yAxisQuantitative.tickFormat(',.0f').build();
    const dataConfig = this.stackedArea
      .data(data)
      .createXDateDimension((dimension) =>
        dimension.valueAccessor((d) => d.date)
      )
      .createYNumericDimension((dimension) =>
        dimension.valueAccessor((d) => d.value)
      )
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.industry)
      )
      .build();
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(
    data: VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(
    output: VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(output);
  }

  updateTooltipConfig(
    output: VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    const config = this.tooltip
      .setSize((size) => size.minWidth(130))
      .createOffsetFromOriginPosition((position) =>
        position
          .offsetX(output?.positionX)
          .offsetY(output ? output.categoryYMin - 5 : undefined)
      )
      .show(output?.hoveredDatum !== undefined)
      .build();
    this.tooltipConfig.next(config);
  }
}
