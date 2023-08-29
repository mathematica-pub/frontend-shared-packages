import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { format } from 'd3';
import { AxisConfig } from 'projects/viz-components/src/lib/axes/axis.config';
import { BarsHoverShowLabels } from 'projects/viz-components/src/lib/bars/bars-hover-effects';
import { BarsHoverMoveDirective } from 'projects/viz-components/src/lib/bars/bars-hover-move.directive';
import { BarsHoverDirective } from 'projects/viz-components/src/lib/bars/bars-hover.directive';
import {
  BarsConfig,
  BarsLabelsConfig,
  HorizontalBarsDimensionsConfig,
} from 'projects/viz-components/src/lib/bars/bars.config';
import { ElementSpacing } from 'projects/viz-components/src/lib/chart/chart.component';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import {
  BarsClickDirective,
  BarsClickEmitTooltipDataPauseHoverMoveEffects,
  BarsHoverMoveEmitTooltipData,
  RoundUpToIntervalDomainPaddingConfig,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';
import { BarsEventOutput } from 'projects/viz-components/src/lib/bars/bars-tooltip-data';

interface ViewModel {
  dataConfig: BarsConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}

class BarsExampleTooltipConfig extends HtmlTooltipConfig {
  constructor(config: Partial<HtmlTooltipConfig> = {}) {
    super();
    this.size.minWidth = 130;
    Object.assign(this, config);
  }
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
      new HtmlTooltipConfig(new BarsExampleTooltipConfig())
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput> =
    new BehaviorSubject<BarsEventOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveEffects: EventEffect<BarsHoverMoveDirective>[] = [
    new BarsHoverMoveEmitTooltipData(),
  ];
  hoverEffects: EventEffect<BarsHoverDirective>[] = [new BarsHoverShowLabels()];

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
    xAxisConfig.tickFormat = '.0f';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new BarsConfig();
    dataConfig.labels = new BarsLabelsConfig();
    dataConfig.labels.display = false;
    dataConfig.quantitative.valueFormat = (d: any) => {
      const label =
        d.value === undefined || d.value === null
          ? 'N/A'
          : format('.1f')(d.value);
      return d.value > 8 ? `${label}*` : label;
    };
    dataConfig.data = filteredData;
    dataConfig.dimensions = new HorizontalBarsDimensionsConfig();
    dataConfig.ordinal.valueAccessor = (d) => d.division;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    dataConfig.classAccessor = (d) =>
      d.division === 'Bethesda-Rockville-Frederick, MD Met Div'
        ? 'interactive'
        : '';
    dataConfig.quantitative.domainPadding =
      new RoundUpToIntervalDomainPaddingConfig();
    dataConfig.quantitative.domainPadding.interval = () => 4;
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(data: BarsEventOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput): void {
    const config = new BarsExampleTooltipConfig();
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY;
      config.show = true;
      config.origin = data.elRef;
    } else {
      config.show = false;
      config.origin = undefined;
    }
    this.tooltipConfig.next(config);
  }
}
