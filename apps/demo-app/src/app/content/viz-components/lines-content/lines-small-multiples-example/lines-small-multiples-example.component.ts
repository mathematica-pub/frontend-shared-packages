import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  ChartConfig,
  EventAction,
  HoverMoveAction,
  HtmlTooltipConfig,
  LinesClickDirective,
  LinesClickEmitTooltipDataPauseHoverMoveActions,
  LinesConfig,
  LinesEventOutput,
  LinesHoverMoveDefaultStyles,
  LinesHoverMoveDirective,
  LinesHoverMoveEmitTooltipData,
  VicChartConfigBuilder,
  VicChartModule,
  VicDataExport,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { MetroUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { HighlightLineForLabel } from './line-small-multiples-input-actions';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: LinesConfig<MetroUnemploymentDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  labels: string[];
}
const includeFiles = ['line-input-actions.ts'];

@Component({
  selector: 'app-lines-small-multiples-example',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicLinesModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXQuantitativeAxisModule,
    VicHtmlTooltipModule,
    MatButtonToggleModule,
  ],
  templateUrl: './lines-small-multiples-example.component.html',
  styleUrls: ['./lines-small-multiples-example.component.scss'],
  providers: [
    VicChartConfigBuilder,
    VicLinesConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class LinesSmallMultiplesExampleComponent implements OnInit {
  @ViewChild('imageNode') imageNode: ElementRef<HTMLElement>;
  vm$: Observable<ViewModel>;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesEventOutput<MetroUnemploymentDatum>> =
    new BehaviorSubject<LinesEventOutput<MetroUnemploymentDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  chartInputEvent: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  chartInputEvent$ = this.chartInputEvent.asObservable();
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();
  highlightLineForLabelAction = new HighlightLineForLabel();
  hoverActions: HoverMoveAction<
    LinesHoverMoveDirective<MetroUnemploymentDatum>
  >[] = [
    new LinesHoverMoveDefaultStyles(),
    new LinesHoverMoveEmitTooltipData(),
  ];
  clickActions: EventAction<LinesClickDirective<MetroUnemploymentDatum>>[] = [
    new LinesClickEmitTooltipDataPauseHoverMoveActions(),
  ];
  includeFiles = includeFiles;
  folderName = 'lines-example';

  constructor(
    private dataService: DataService,
    public downloadService: VicDataExport,
    private chart: VicChartConfigBuilder,
    private lines: VicLinesConfigBuilder<MetroUnemploymentDatum>,
    private xAxisQuantitative: VicXQuantitativeAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const chartConfig = this.chart
      .margin({
        top: 36,
        right: 12,
        bottom: 36,
        left: 64,
      })
      .getConfig();
    // axis configs should pertain to all charts -- that is a principle of small multiples
    const xAxisConfig = this.xAxisQuantitative
      .tickFormat('%Y')
      .label((label) => label.position('middle').text('Year'))
      .getConfig();
    const yAxisConfig = this.yAxisQuantitative
      .label((label) =>
        label
          .position('start')
          .text('Percent Unemployment (US Bureau of Labor Statistics)')
          .anchor('start')
          .wrap((wrap) => wrap.width(110).maintainXPosition(true))
          .offset({ x: 8, y: 12 })
      )
      .tickFormat('.0%')
      .getConfig();

    const dataConfig = this.lines
      .data(data)
      .xDate((xDate) => xDate.valueAccessor((d) => d.date))
      .y((y) =>
        y
          .valueAccessor((d) => d.value / 100)
          .domainPaddingPixels(20)
          .formatSpecifier('.1%')
      )
      .stroke((stroke) =>
        stroke.color((color) => color.valueAccessor((d) => d.division))
      )
      .pointMarkers((markers) =>
        markers
          .radius(2)
          .growByOnHover(3)
          .display((d) => d.division.includes('Bethesda-Rockville'))
      )
      .getConfig();

    const labels = [...new Set(data.map((x) => x.division))].slice(0, 9);
    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
      labels,
    };
  }

  updateTooltipForNewOutput(
    data: LinesEventOutput<MetroUnemploymentDatum>,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(tooltipEvent);
  }

  updateTooltipData(data: LinesEventOutput<MetroUnemploymentDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(eventContext: 'click' | 'hover'): void {
    const data = this.tooltipData.getValue();
    const config = this.tooltip
      .size((size) => size.minWidth(340))
      .linesPosition([
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - 16 : 0,
        },
      ])
      .hasBackdrop(eventContext === 'click')
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }

  highlightLine(label: string): void {
    this.chartInputEvent.next(label);
  }

  onBackdropClick(): void {
    this.removeTooltipEvent.next();
    this.updateTooltipConfig('hover');
  }
}
