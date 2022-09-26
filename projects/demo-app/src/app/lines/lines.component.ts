import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/html-tooltip/html-tooltip.config';
import {
  AxisConfig,
  ElementSpacing,
  EmitLinesTooltipData,
  ImageService,
  JpegImageConfig,
  LinesConfig,
  LinesEmittedOutput,
  LinesHoverAndMoveEffectDefaultStyles,
  LinesHoverAndMoveEffectDefaultStylesConfig,
  LinesHoverAndMoveEventDirective,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Documentation } from '../core/enums/documentation.enums';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';
import { HighlightLineForLabel } from './line-input-effects';

interface ViewModel {
  dataConfig: LinesConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
  labels: string[];
}

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit {
  @ViewChild('imageNode') imageNode: ElementRef<HTMLElement>;
  linesDocumentation = Documentation.Lines;
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesEmittedOutput> =
    new BehaviorSubject<LinesEmittedOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  chartInputEvent: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  chartInputEvent$ = this.chartInputEvent.asObservable();
  highlightLineForLabelEffect = new HighlightLineForLabel();
  hoverEffects: EventEffect<LinesHoverAndMoveEventDirective>[] = [
    new LinesHoverAndMoveEffectDefaultStyles(
      new LinesHoverAndMoveEffectDefaultStylesConfig({
        growMarkerDimension: 3,
      })
    ),
    new EmitLinesTooltipData(),
  ];

  private imageService = inject(ImageService);

  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
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

  updateTooltipForNewOutput(data: LinesEmittedOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: LinesEmittedOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: LinesEmittedOutput): void {
    const config = new HtmlTooltipConfig();
    config.panelClass = 'lines-tooltip';
    config.size.minWidth = 340;
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

  downloadImage(): void {
    const imageConfig = new JpegImageConfig({
      containerNode: this.imageNode.nativeElement,
      fileName: 'testfile',
    });
    this.imageService.downloadNode(imageConfig);
  }
}
