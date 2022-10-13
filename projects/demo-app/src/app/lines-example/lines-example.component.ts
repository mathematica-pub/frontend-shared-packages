import { Component, OnInit } from '@angular/core';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/html-tooltip/html-tooltip.config';
import {
  AxisConfig,
  ElementSpacing,
  EmitLinesTooltipData,
  LinesConfig,
  LinesEmittedOutput,
  LinesHoverAndMoveEffectDefaultStyles,
  LinesHoverAndMoveEffectDefaultStylesConfig,
  LinesHoverAndMoveEventDirective,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
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
  selector: 'app-lines-example',
  templateUrl: './lines-example.component.html',
  styleUrls: ['./lines-example.component.scss'],
})
export class LinesExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 4,
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
}
