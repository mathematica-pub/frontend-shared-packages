import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import {
  ChartConfig,
  ElementSpacing,
  EventType,
  HtmlTooltipConfig,
  LinesConfig,
  LinesHost,
  LinesInteractionOutput,
  RefactorEventAction,
  RefactorHoverMoveAction,
  RefactorLinesClickEmitTooltipDataPauseHoverMoveActions,
  RefactorLinesHoverMoveDefaultStyles,
  RefactorLinesHoverMoveEmitTooltipData,
  VicChartConfigBuilder,
  VicChartModule,
  VicColumnConfig,
  VicDataExport,
  VicDataExportConfig,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicImageDownloadService,
  VicJpegImageConfig,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { MetroUnemploymentDatum } from 'apps/demo-app/src/app/core/models/data';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { HighlightLineForLabel } from './line-input-actions';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: LinesConfig<MetroUnemploymentDatum>;
  xAxisConfig: VicXQuantitativeAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
  labels: string[];
}
const includeFiles = ['line-input-actions.ts'];

@Component({
  selector: 'app-lines-example',
  imports: [
    CommonModule,
    VicChartModule,
    VicLinesModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
    MatButtonToggleModule,
  ],
  templateUrl: './lines-example.component.html',
  styleUrls: ['./lines-example.component.scss'],
  providers: [
    VicChartConfigBuilder,
    VicLinesConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class LinesExampleComponent implements OnInit {
  @ViewChild('imageNode') imageNode: ElementRef<HTMLElement>;
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 12,
    bottom: 36,
    left: 64,
  };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesInteractionOutput<MetroUnemploymentDatum>> =
    new BehaviorSubject<LinesInteractionOutput<MetroUnemploymentDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  chartInputEvent: Subject<string> = new Subject<string>();
  chartInputEvent$ = this.chartInputEvent.asObservable();
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();
  highlightLineForLabelAction =
    new HighlightLineForLabel<MetroUnemploymentDatum>();
  hoverActions: RefactorHoverMoveAction<LinesHost<MetroUnemploymentDatum>>[] = [
    new RefactorLinesHoverMoveDefaultStyles(),
    new RefactorLinesHoverMoveEmitTooltipData(),
  ];
  clickActions: RefactorEventAction<LinesHost<MetroUnemploymentDatum>>[] = [
    new RefactorLinesClickEmitTooltipDataPauseHoverMoveActions(),
  ];
  includeFiles = includeFiles;
  folderName = 'lines-example';
  tooltipEvent: BehaviorSubject<'hover' | 'click'> = new BehaviorSubject<
    'hover' | 'click'
  >('click');
  tooltipEvent$ = this.tooltipEvent.asObservable();
  private imageService = inject(VicImageDownloadService);

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

  onEventToggleChange(change: MatButtonToggleChange): void {
    this.tooltipEvent.next(change.value);
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const chartConfig = this.chart.margin(this.margin).getConfig();
    const xAxisConfig = this.xAxisQuantitative
      .ticks((ticks) => ticks.format('%Y'))
      .label((label) => label.position('middle').text('Year'))
      .getConfig();
    const yAxisConfig = this.yAxisQuantitative
      .label((label) =>
        label
          .text('Percent Unemployment (US Bureau of Labor Statistics)')
          .wrap((wrap) => wrap.width(180).lineHeight(1.2))
      )
      .ticks((ticks) => ticks.format('.0%'))
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
      .areaFills((fills) =>
        fills.display((category) => category.includes('Bethesda-Rockville'))
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
    data: LinesInteractionOutput<MetroUnemploymentDatum>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data?.type);
  }

  updateTooltipData(
    data: LinesInteractionOutput<MetroUnemploymentDatum>
  ): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(eventType: EventType | undefined): void {
    const data = this.tooltipData.getValue();
    const config = this.tooltip
      .size((size) => size.minWidth(340))
      .linesPosition([
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - 16 : 0,
        },
      ])
      .hasBackdrop(eventType === 'click')
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }

  highlightLine(label: string): void {
    this.chartInputEvent.next(label);
  }

  onBackdropClick(): void {
    this.removeTooltipEvent.next();
    this.updateTooltipConfig(EventType.Hover);
  }

  async downloadImage(): Promise<void> {
    const imageConfig = new VicJpegImageConfig({
      containerNode: this.imageNode.nativeElement,
      fileName: 'testfile',
    });
    await this.imageService.downloadImage(imageConfig);
  }

  saveCsv(data): void {
    const lineMetadata = [
      {
        fileType: 'csv',
        numFiles: 1,
        typesOfCoolThings: 'many cool things, bruv',
      },
      {
        fileType: 'excel',
        numFiles: 3,
        typesOfCoolThings: 'so many dope things',
      },
    ];

    const dataConfig = new VicDataExportConfig({
      data: data,
      includeAllKeysAsDefault: true,
    });
    const lineMetadataConfig = new VicDataExportConfig({
      data: lineMetadata,
      flipped: true,
      flippedHeaderKey: 'fileType',
      marginBottom: 2,
      defaultColumnList: ['fileType', 'numFiles'],
      columns: [
        new VicColumnConfig({
          title: 'Types of Cool ThInGs',
          valueAccessor: (x) => x.typesOfCoolThings,
        }),
      ],
    });

    this.downloadService.saveCSV('lines-example', [
      lineMetadataConfig,
      dataConfig,
    ]);
  }
}
