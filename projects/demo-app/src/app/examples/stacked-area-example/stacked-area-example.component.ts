import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis-config';
import { ElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { HoverMoveAction } from 'projects/viz-components/src/lib/events/action';
import { StackedAreaConfig } from 'projects/viz-components/src/lib/stacked-area/config/stacked-area-config';
import { StackedAreaEventOutput } from 'projects/viz-components/src/lib/stacked-area/events/stacked-area-event-output';
import { VicHtmlTooltipConfigBuilder } from 'projects/viz-components/src/lib/tooltips/html-tooltip/config/html-tooltip-builder';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/tooltips/html-tooltip/config/html-tooltip-config';
import {
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
  VicChartModule,
  VicHtmlTooltipModule,
  VicStackedAreaConfigBuilder,
  VicStackedAreaModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../../core/models/data';
import { DataService } from '../../core/services/data.service';
import { ExampleDisplayComponent } from '../../example-display/example-display.component';

interface ViewModel {
  dataConfig: StackedAreaConfig<IndustryUnemploymentDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-area-example',
  standalone: true,
  imports: [
    CommonModule,
    ExampleDisplayComponent,
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
    const xAxisConfig = this.xAxisQuantitative.tickFormat('%Y').getConfig();
    const yAxisConfig = this.yAxisQuantitative.tickFormat(',.0f').getConfig();
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
      .getConfig();
    return {
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
    output: StackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(output);
  }

  updateTooltipConfig(
    output: StackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    const config = this.tooltip
      .setSize((size) => size.minWidth(130))
      .createOffsetFromOriginPosition((position) =>
        position
          .offsetX(output?.positionX)
          .offsetY(output ? output.categoryYMin - 5 : undefined)
      )
      .show(output?.hoveredDatum !== undefined)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
