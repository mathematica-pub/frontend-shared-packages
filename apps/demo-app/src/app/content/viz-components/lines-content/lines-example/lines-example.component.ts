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
  ElementSpacing,
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
import { HighlightLineForLabel } from './line-input-actions';

interface ViewModel {
  dataConfig: LinesConfig<MetroUnemploymentDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  labels: string[];
}
const includeFiles = ['line-input-actions.ts'];

@Component({
  selector: 'app-lines-example',
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
  templateUrl: './lines-example.component.html',
  styleUrls: ['./lines-example.component.scss'],
  providers: [
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
    right: 4,
    bottom: 36,
    left: 64,
  };
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
  tooltipEvent: BehaviorSubject<'hover' | 'click'> = new BehaviorSubject<
    'hover' | 'click'
  >('click');
  tooltipEvent$ = this.tooltipEvent.asObservable();
  private imageService = inject(VicImageDownloadService);

  constructor(
    private dataService: DataService,
    public downloadService: VicDataExport,
    public lines: VicLinesConfigBuilder<MetroUnemploymentDatum>,
    private xAxisQuantitative: VicXQuantitativeAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    console.log('ini');
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  onEventToggleChange(change: MatButtonToggleChange): void {
    this.tooltipEvent.next(change.value);
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    console.log('what');
    const xAxisConfig = this.xAxisQuantitative
      .tickFormat('%Y')
      .label((label) => label.position('middle').text('Year'))
      .getConfig();
    const yAxisConfig = this.yAxisQuantitative
      .label((label) =>
        label
          .position('start')
          .text('Percent Unemployment')
          .anchor('start')
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
