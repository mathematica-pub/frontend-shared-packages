import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InternSet, schemeTableau10 } from 'd3';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis-config';
import { ElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { HoverMoveAction } from 'projects/viz-components/src/lib/events/action';
import { LinesConfig } from 'projects/viz-components/src/lib/lines/config/lines-config';
import { StackedAreaConfig } from 'projects/viz-components/src/lib/stacked-area/config/stacked-area-config';
import { StackedAreaEventOutput } from 'projects/viz-components/src/lib/stacked-area/events/stacked-area-event-output';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/tooltips/html-tooltip/config/html-tooltip-config';
import {
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicLinesConfigBuilder,
  VicStackedAreaConfigBuilder,
  VicStackedAreaModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { IndustryUnemploymentDatum } from '../../core/models/data';
import { DataService } from '../../core/services/data.service';
import { ExampleDisplayComponent } from '../../example-display/example-display.component';
import { StandaloneLineComponent } from './standalone-line.component';

interface ViewModel {
  stackedAreaConfig: StackedAreaConfig<IndustryUnemploymentDatum, string>;
  linesConfig: LinesConfig<IndustryUnemploymentDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-area-and-line-example',
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
    StandaloneLineComponent,
  ],
  providers: [
    VicStackedAreaConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
    VicLinesConfigBuilder,
  ],
  templateUrl: './stacked-area-and-line-example.component.html',
  styleUrl: './stacked-area-and-line-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedAreaAndLineExampleComponent implements OnInit {
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
    private lines: VicLinesConfigBuilder<IndustryUnemploymentDatum>,
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

    const categories = [...new Set(data.map((d) => d.industry))];
    const categoryColors = categories.map((category, i) => {
      if (i < schemeTableau10.length) {
        return schemeTableau10[i];
      } else {
        return schemeTableau10[i % schemeTableau10.length];
      }
    });

    const stackedAreaConfig = this.stackedArea
      .data(data)
      .createXDateDimension((dimension) =>
        dimension.valueAccessor((d) => d.date)
      )
      .createYNumericDimension((dimension) =>
        dimension.valueAccessor((d) => d.value).domainPaddingPixels(20)
      )
      .createCategoricalDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.industry)
          .domain([...categories, 'Total'])
          .range([...categoryColors, 'black'])
      )
      .getConfig();

    const totalsData = [...new InternSet(data.map((d) => d.date))].map((d) => {
      const dataForDate = data.filter(
        (datum) => datum.date.valueOf() === d.valueOf()
      );
      const value = dataForDate.reduce((acc, curr) => {
        acc += curr.value;
        return acc;
      }, 0);
      return { value, date: d, industry: 'Total' };
    });

    const linesConfig = this.lines
      .data(totalsData)
      .createXDateDimension((dimension) =>
        dimension.valueAccessor((d) => d.date)
      )
      .createYDimension((dimension) => dimension.valueAccessor((d) => d.value))
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.industry).range(['black'])
      )
      .createStroke((stroke) => stroke.width(2))
      .createPointMarkers((markers) => markers.radius(2))
      .build();

    return {
      stackedAreaConfig: stackedAreaConfig,
      linesConfig: linesConfig,
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
