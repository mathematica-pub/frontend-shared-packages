import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { AxisConfig } from 'projects/viz-components/src/lib/axes/axis.config';
import { ElementSpacing } from 'projects/viz-components/src/lib/chart/chart.component';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { VicExportDataService } from 'projects/viz-components/src/lib/export-data/export-data.service';
import { VicJpegImageConfig } from 'projects/viz-components/src/lib/image-download/image.config';
import { VicImageService } from 'projects/viz-components/src/lib/image-download/image.service';
import { LinesClickEmitTooltipDataPauseHoverMoveEffects } from 'projects/viz-components/src/lib/lines/lines-click-effects';
import { LinesClickDirective } from 'projects/viz-components/src/lib/lines/lines-click.directive';
import {
  LinesHoverMoveDefaultStyles,
  LinesHoverMoveDefaultStylesConfig,
  LinesHoverMoveEmitTooltipData,
} from 'projects/viz-components/src/lib/lines/lines-hover-move-effects';

import { LinesHoverMoveDirective } from 'projects/viz-components/src/lib/lines/lines-hover-move.directive';
import { LinesEventOutput } from 'projects/viz-components/src/lib/lines/lines-tooltip-data';
import { LinesConfig } from 'projects/viz-components/src/lib/lines/lines.config';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';
import { HighlightLineForLabel } from './line-input-effects';

interface ViewModel {
  dataConfig: LinesConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
  labels: string[];
}
const includeFiles = ['line-input-effects.ts'];

class LinesExampleTooltipConfig extends HtmlTooltipConfig {
  constructor(config: Partial<HtmlTooltipConfig> = {}) {
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
  margin: ElementSpacing = {
    top: 8,
    right: 4,
    bottom: 36,
    left: 64,
  };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new LinesExampleTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesEventOutput> =
    new BehaviorSubject<LinesEventOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  chartInputEvent: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  chartInputEvent$ = this.chartInputEvent.asObservable();
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();
  highlightLineForLabelEffect = new HighlightLineForLabel();
  hoverEffects: EventEffect<LinesHoverMoveDirective>[] = [
    new LinesHoverMoveDefaultStyles(
      new LinesHoverMoveDefaultStylesConfig({
        growMarkerDimension: 3,
      })
    ),
    new LinesHoverMoveEmitTooltipData(),
  ];
  clickEffects: EventEffect<LinesClickDirective>[] = [
    new LinesClickEmitTooltipDataPauseHoverMoveEffects(),
  ];
  includeFiles = includeFiles;
  folderName = 'lines-example';
  tooltipEvent: BehaviorSubject<'hover' | 'click'> = new BehaviorSubject<
    'hover' | 'click'
  >('hover');
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
    const xAxisConfig = new AxisConfig();
    xAxisConfig.tickFormat = '%Y';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new LinesConfig();
    dataConfig.data = data;
    dataConfig.x.valueAccessor = (d) => d.date;
    dataConfig.x.valueFormat = '%a %B %d %Y';
    dataConfig.y.valueAccessor = (d) => d.value;
    dataConfig.category.valueAccessor = (d) => d.division;
    dataConfig.pointMarkers.radius = 2;
    const labels = [...new Set(data.map((x) => x.division))].slice(0, 9);

    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
      labels,
    };
  }

  updateTooltipForNewOutput(
    data: LinesEventOutput,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data, tooltipEvent);
  }

  updateTooltipData(data: LinesEventOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: LinesEventOutput,
    eventContext: 'click' | 'hover'
  ): void {
    const config = new LinesExampleTooltipConfig();
    config.hasBackdrop = eventContext === 'click';
    config.closeOnBackdropClick = eventContext === 'click';
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
}
