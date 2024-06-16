import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis.config';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { VicPixelDomainPadding } from 'projects/viz-components/src/lib/data-dimensions/quantitative/domain-padding/pixel';
import {
  EventEffect,
  HoverMoveEventEffect,
} from 'projects/viz-components/src/lib/events/effect';
import {
  VicColumnConfig,
  VicDataExportConfig,
} from 'projects/viz-components/src/lib/export-data/data-export.config';
import { VicExportDataService } from 'projects/viz-components/src/lib/export-data/export-data.service';
import { VicJpegImageConfig } from 'projects/viz-components/src/lib/image-download/image.config';
import { VicImageService } from 'projects/viz-components/src/lib/image-download/image.service';
import { VicLinesConfig } from 'projects/viz-components/src/lib/lines/config/lines.config';
import { LinesClickEmitTooltipDataPauseHoverMoveEffects } from 'projects/viz-components/src/lib/lines/lines-click-effects';
import { LinesClickDirective } from 'projects/viz-components/src/lib/lines/lines-click.directive';
import {
  LinesHoverMoveDefaultStyles,
  LinesHoverMoveDefaultStylesConfig,
  LinesHoverMoveEmitTooltipData,
} from 'projects/viz-components/src/lib/lines/lines-hover-move-effects';
import { LinesHoverMoveDirective } from 'projects/viz-components/src/lib/lines/lines-hover-move.directive';
import { VicLinesEventOutput } from 'projects/viz-components/src/lib/lines/lines-tooltip-data';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import { Vic } from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';
import { HighlightLineForLabel } from './line-input-effects';

interface ViewModel {
  dataConfig: VicLinesConfig<MetroUnemploymentDatum>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  labels: string[];
}
const includeFiles = ['line-input-effects.ts'];

class LinesExampleTooltipConfig extends VicHtmlTooltipConfig {
  constructor(config: Partial<VicHtmlTooltipConfig> = {}) {
    super();
    this.size.minWidth = 340;
    Object.assign(this, config);
  }
}

@Component({
  selector: 'app-lines-example',
  templateUrl: './lines-example.component.html',
  styleUrls: ['./lines-example.component.scss'],
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
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new LinesExampleTooltipConfig({ show: false })
    );
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
    public downloadService: VicExportDataService
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
    const xAxisConfig = Vic.axisXQuantitative<Date>({
      tickFormat: '%Y',
    });
    const yAxisConfig = Vic.axisYQuantitative<number>();
    const dataConfig = Vic.lines<MetroUnemploymentDatum>({
      data,
      x: Vic.dimensionDate<MetroUnemploymentDatum>({
        valueAccessor: (d) => d.date,
        valueFormat: '%a %B %d %Y',
      }),
      y: Vic.dimensionQuantitative<MetroUnemploymentDatum>({
        valueAccessor: (d) => d.value,
        domainPadding: new VicPixelDomainPadding({ numPixels: 20 }),
      }),
      categorical: Vic.dimensionCategorical<MetroUnemploymentDatum>({
        valueAccessor: (d) => d.division,
      }),
      pointMarkers: Vic.linesPointMarkers({ radius: 2 }),
    });
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
    this.updateTooltipConfig(data, tooltipEvent);
  }

  updateTooltipData(data: VicLinesEventOutput<MetroUnemploymentDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: VicLinesEventOutput<MetroUnemploymentDatum>,
    eventContext: 'click' | 'hover'
  ): void {
    const config = new LinesExampleTooltipConfig();
    config.hasBackdrop = eventContext === 'click';
    config.closeOnBackdropClick = eventContext === 'click';
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 16;
      config.show = true;
    } else {
      config.position.offsetX = null;
      config.position.offsetY = null;
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }

  highlightLine(label: string): void {
    this.chartInputEvent.next(label);
  }

  onBackdropClick(): void {
    this.removeTooltipEvent.next();
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
