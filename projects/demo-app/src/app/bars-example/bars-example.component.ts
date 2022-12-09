import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AxisConfig } from 'projects/viz-components/src/lib/axes/axis.config';
import { BarsHoverEffectShowLabels } from 'projects/viz-components/src/lib/bars/bars-hover-effects';
import { BarsHoverEventDirective } from 'projects/viz-components/src/lib/bars/bars-hover-event.directive';
import {
  BarsHoverAndMoveEmittedOutput,
  BarsHoverAndMoveEventDirective,
} from 'projects/viz-components/src/lib/bars/bars-hover-move-event.directive';
import {
  BarsConfig,
  BarsLabelsConfig,
  HorizontalBarsDimensionsConfig,
} from 'projects/viz-components/src/lib/bars/bars.config';
import { ElementSpacing } from 'projects/viz-components/src/lib/chart/chart.component';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/html-tooltip/html-tooltip.config';
import { BarsHoverAndMoveEffectEmitTooltipData } from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: BarsConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}
@Component({
  selector: 'app-bars-example',
  templateUrl: './bars-example.component.html',
  styleUrls: ['./bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 36,
    right: 0,
    bottom: 8,
    left: 300,
  };
  folderName = 'bars-example';
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsHoverAndMoveEmittedOutput> =
    new BehaviorSubject<BarsHoverAndMoveEmittedOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveEffects: EventEffect<BarsHoverAndMoveEventDirective>[] = [
    new BarsHoverAndMoveEffectEmitTooltipData(),
  ];
  hoverEffects: EventEffect<BarsHoverEventDirective>[] = [
    new BarsHoverEffectShowLabels(),
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
    );
    const xAxisConfig = new AxisConfig();
    xAxisConfig.tickFormat = '.1f';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new BarsConfig();
    dataConfig.labels = new BarsLabelsConfig();
    dataConfig.labels.display = false;
    dataConfig.data = filteredData;
    dataConfig.dimensions = new HorizontalBarsDimensionsConfig();
    dataConfig.ordinal.valueAccessor = (d) => d.division;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    dataConfig.quantitative.valueFormat = '.1f';
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(data: BarsHoverAndMoveEmittedOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsHoverAndMoveEmittedOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsHoverAndMoveEmittedOutput): void {
    const config = new HtmlTooltipConfig();
    config.position.panelClass = 'bar-tooltip'; // not used
    config.size.minWidth = 130;
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 16;
      config.show = true;
      config.origin = data.elRef;
    } else {
      config.show = false;
      config.origin = undefined;
    }
    this.tooltipConfig.next(config);
  }
}
