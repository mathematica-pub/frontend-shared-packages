import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/html-tooltip/html-tooltip.config';
import { LinesMarkerClickEffectEmitTooltipData } from 'projects/viz-components/src/lib/lines/lines-marker-click-effects';
import { LinesMarkerClickEventDirective } from 'projects/viz-components/src/lib/lines/lines-marker-click-event.directive';
import {
  AxisConfig,
  ElementSpacing,
  LinesConfig,
  LinesEmittedOutput,
  LinesHoverAndMoveEffectDefaultStyles,
  LinesHoverAndMoveEffectDefaultStylesConfig,
  LinesHoverAndMoveEffectEmitTooltipData,
  LinesHoverAndMoveEventDirective,
  VicExportDataService,
  VicImageService,
  VicJpegImageConfig,
} from 'projects/viz-components/src/public-api';
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
    this.hasBackdrop = true;
    this.closeOnBackdropClick = true;
    Object.assign(this, config);
  }
}

const initTooltipConfig = new HtmlTooltipConfig({ show: false });

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
      new HtmlTooltipConfig(initTooltipConfig)
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesEmittedOutput> =
    new BehaviorSubject<LinesEmittedOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  chartInputEvent: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  chartInputEvent$ = this.chartInputEvent.asObservable();
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();
  highlightLineForLabelEffect = new HighlightLineForLabel();
  hoverEffects: EventEffect<LinesHoverAndMoveEventDirective>[] = [
    new LinesHoverAndMoveEffectDefaultStyles(
      new LinesHoverAndMoveEffectDefaultStylesConfig({
        growMarkerDimension: 3,
      })
    ),
    new LinesHoverAndMoveEffectEmitTooltipData(),
  ];
  clickEffects: EventEffect<LinesMarkerClickEventDirective>[] = [
    new LinesMarkerClickEffectEmitTooltipData(),
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
    // need to provide correct tooltip config before tooltip direct inits
    if (change.value === 'click') {
      const clickTooltipConfig = new LinesExampleTooltipConfig({ show: false });
      this.tooltipConfig.next(clickTooltipConfig);
    }
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
    dataConfig.pointMarker.radius = 2;
    const labels = [...new Set(data.map((x) => x.division))].slice(0, 9);

    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
      labels,
    };
  }

  updateTooltipForNewOutput(
    data: LinesEmittedOutput,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    if (tooltipEvent === 'hover') {
      this.updateHoverTooltipConfig(data);
    } else {
      this.updateClickTooltipConfig(data);
    }
  }

  updateTooltipData(data: LinesEmittedOutput): void {
    this.tooltipData.next(data);
  }

  updateHoverTooltipConfig(data: LinesEmittedOutput): void {
    const config = new HtmlTooltipConfig();
    config.hasBackdrop = false;
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 16;
      config.show = true;
    } else {
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }

  updateClickTooltipConfig(data: LinesEmittedOutput): void {
    const config = new LinesExampleTooltipConfig();
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 16;
      config.show = true;
    } else {
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
