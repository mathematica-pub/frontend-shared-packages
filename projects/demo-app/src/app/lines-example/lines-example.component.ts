import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis-config';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import {
  EventEffect,
  HoverMoveEventEffect,
} from 'projects/viz-components/src/lib/events/effect';
import { LinesConfig } from 'projects/viz-components/src/lib/lines/config/lines-config';
import { VicLinesEventOutput } from 'projects/viz-components/src/lib/lines/lines-tooltip-data';
import { VicHtmlTooltipBuilder } from 'projects/viz-components/src/lib/tooltips/html-tooltip/config/html-tooltip-builder';
import {
  HtmlTooltipConfig,
  LinesClickDirective,
  LinesClickEmitTooltipDataPauseHoverMoveEffects,
  LinesHoverMoveDefaultStyles,
  LinesHoverMoveDefaultStylesConfig,
  LinesHoverMoveDirective,
  LinesHoverMoveEmitTooltipData,
  VicColumnConfig,
  VicDataExportConfig,
  VicExportDataService,
  VicImageService,
  VicJpegImageConfig,
  VicLinesBuilder,
  VicXQuantitativeAxisBuilder,
  VicYQuantitativeAxisBuilder,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';
import { HighlightLineForLabel } from './line-input-effects';

interface ViewModel {
  dataConfig: LinesConfig<MetroUnemploymentDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  labels: string[];
}
const includeFiles = ['line-input-effects.ts'];

@Component({
  selector: 'app-lines-example',
  templateUrl: './lines-example.component.html',
  styleUrls: ['./lines-example.component.scss'],
  providers: [
    VicLinesBuilder,
    VicYQuantitativeAxisBuilder,
    VicXQuantitativeAxisBuilder,
    VicHtmlTooltipBuilder,
  ],
})
export class LinesExampleComponent implements OnInit {
  @ViewChild('imageNode') imageNode: ElementRef<HTMLElement>;
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 4,
    bottom: 36,
    left: 64,
  };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<VicLinesEventOutput<MetroUnemploymentDatum>> =
    new BehaviorSubject<VicLinesEventOutput<MetroUnemploymentDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  chartInputEvent: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  chartInputEvent$ = this.chartInputEvent.asObservable();
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();
  highlightLineForLabelEffect = new HighlightLineForLabel();
  hoverEffects: HoverMoveEventEffect<
    LinesHoverMoveDirective<MetroUnemploymentDatum>
  >[] = [
    new LinesHoverMoveDefaultStyles(
      new LinesHoverMoveDefaultStylesConfig({
        growMarkerDimension: 3,
      })
    ),
    new LinesHoverMoveEmitTooltipData(),
  ];
  clickEffects: EventEffect<LinesClickDirective<MetroUnemploymentDatum>>[] = [
    new LinesClickEmitTooltipDataPauseHoverMoveEffects(),
  ];
  includeFiles = includeFiles;
  folderName = 'lines-example';
  tooltipEvent: BehaviorSubject<'hover' | 'click'> = new BehaviorSubject<
    'hover' | 'click'
  >('click');
  tooltipEvent$ = this.tooltipEvent.asObservable();

  private imageService = inject(VicImageService);
  constructor(
    private dataService: DataService,
    public downloadService: VicExportDataService,
    public lines: VicLinesBuilder<MetroUnemploymentDatum>,
    private xAxisQuantitative: VicXQuantitativeAxisBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisBuilder<number>,
    private tooltip: VicHtmlTooltipBuilder
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
    const xAxisConfig = this.xAxisQuantitative.tickFormat('%Y').build();
    const yAxisConfig = this.yAxisQuantitative.build();
    const dataConfig = new VicLinesBuilder<MetroUnemploymentDatum>()
      .data(data)
      .createXDateDimension((dimension) =>
        dimension.valueAccessor((d) => d.date)
      )
      .createYDimension((dimension) =>
        dimension.valueAccessor((d) => d.value).domainPaddingPixels(20)
      )
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.division)
      )
      .createPointMarkers((markers) => markers.radius(2))
      .build();

    const labels = [...new Set(data.map((x) => x.division))].slice(0, 9);
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
      labels,
    };
  }

  updateTooltipForNewOutput(
    data: VicLinesEventOutput<MetroUnemploymentDatum>,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(tooltipEvent);
  }

  updateTooltipData(data: VicLinesEventOutput<MetroUnemploymentDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(eventContext: 'click' | 'hover'): void {
    const data = this.tooltipData.getValue();
    const config = this.tooltip
      .setSize((size) => size.minWidth(340))
      .createOffsetFromOriginPosition((position) =>
        position
          .offsetX(data?.positionX)
          .offsetY(data ? data.positionY - 16 : undefined)
      )
      .hasBackdrop(eventContext === 'click')
      .show(!!data)
      .build();
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
    await this.imageService.downloadNode(imageConfig);
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
