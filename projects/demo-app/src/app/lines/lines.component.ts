import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import {
  AxisConfig,
  ElementSpacing,
  EmitLinesTooltipData,
  LinesConfig,
  LinesEmittedOutput,
  LinesHoverAndMoveEffect,
  LinesHoverAndMoveEffectDefaultStyles,
  LinesHoverAndMoveEffectDefaultStylesConfig,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Documentation } from '../core/enums/documentation.enums';
import { MetroUnemploymentDatum } from '../core/models/unemployement-data';
import { DataService } from '../core/services/data.service';
import { HighlightLineForLabel } from './line-input-effects';

interface ViewModel {
  dataConfig: LinesConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
  labels: string[];
  hoverEffects: LinesHoverAndMoveEffect[];
}

type DemoLinesTooltip = LinesEmittedOutput & {
  position: ConnectedPosition;
  show: boolean;
};

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit {
  linesDocumentation = Documentation.Lines;
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  tooltipConfig: BehaviorSubject<DemoLinesTooltip> =
    new BehaviorSubject<DemoLinesTooltip>({
      show: false,
      position: {
        originX: 'start',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
      },
    } as DemoLinesTooltip);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  chartInputEvent: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  chartInputEvent$ = this.chartInputEvent.asObservable();
  highlightLineForLabelEffect = new HighlightLineForLabel();

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
    const hoverEffects = [
      new LinesHoverAndMoveEffectDefaultStyles(
        new LinesHoverAndMoveEffectDefaultStylesConfig({
          growMarkerDimension: 3,
        })
      ),
      new EmitLinesTooltipData(),
    ];
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
      labels,
      hoverEffects,
    };
  }

  processHoverData(data: LinesEmittedOutput): void {
    let config = {} as DemoLinesTooltip;
    const position: ConnectedPosition = {
      originX: 'start',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
    };
    if (data) {
      position.offsetX = data.positionX;
      position.offsetY = data.positionY - 16;
      config = { ...config, ...data };
      config.show = true;
    } else {
      config.show = false;
    }
    config.position = position;
    this.tooltipConfig.next(config);
  }

  highlightLine(label: string): void {
    this.chartInputEvent.next(label);
  }
}
