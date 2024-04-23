import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { format } from 'd3';
import { VicAxisConfig } from 'projects/viz-components/src/lib/axes/axis.config';
import { BarsHoverShowLabels } from 'projects/viz-components/src/lib/bars/bars-hover-effects';
import { BarsHoverMoveDirective } from 'projects/viz-components/src/lib/bars/bars-hover-move.directive';
import { BarsHoverDirective } from 'projects/viz-components/src/lib/bars/bars-hover.directive';
import { VicBarsEventOutput } from 'projects/viz-components/src/lib/bars/bars-tooltip-data';
import {
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicHorizontalBarsDimensionsConfig,
} from 'projects/viz-components/src/lib/bars/bars.config';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { VicPixelDomainPaddingConfig } from 'projects/viz-components/src/lib/data-marks/dimensions/domain-padding.ts/pixel-padding';
import {
  EventEffect,
  HoverMoveEventEffect,
} from 'projects/viz-components/src/lib/events/effect';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import { BarsHoverMoveEmitTooltipData } from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicBarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig: VicAxisConfig;
  yAxisConfig: VicAxisConfig;
}

class BarsExampleTooltipConfig extends VicHtmlTooltipConfig {
  constructor(config: Partial<VicHtmlTooltipConfig> = {}) {
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
  margin: VicElementSpacing = {
    top: 36,
    right: 0,
    bottom: 8,
    left: 300,
  };
  folderName = 'bars-example';
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig(new BarsExampleTooltipConfig())
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<
    VicBarsEventOutput<MetroUnemploymentDatum, string>
  > = new BehaviorSubject<VicBarsEventOutput<MetroUnemploymentDatum, string>>(
    null
  );
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveEffects: HoverMoveEventEffect<
    BarsHoverMoveDirective<MetroUnemploymentDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];
  hoverEffects: EventEffect<
    BarsHoverDirective<MetroUnemploymentDatum, string>
  >[] = [new BarsHoverShowLabels()];

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
    const xAxisConfig = new VicAxisConfig({
      tickFormat: '.0f',
    });
    const yAxisConfig = new VicAxisConfig();
    const dataConfig = new VicBarsConfig<MetroUnemploymentDatum, string>();
    dataConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    dataConfig.data = filteredData;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    dataConfig.quantitative.valueFormat = (d: any) => {
      const label =
        d.value === undefined || d.value === null
          ? 'N/A'
          : format('.1f')(d.value);
      return d.value > 8 ? `${label}*` : label;
    };
    dataConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig();
    dataConfig.ordinal.valueAccessor = (d) => d.division;
    dataConfig.labels = new VicBarsLabelsConfig({
      display: false,
    });
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(
    data: VicBarsEventOutput<MetroUnemploymentDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(
    data: VicBarsEventOutput<MetroUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: VicBarsEventOutput<MetroUnemploymentDatum, string>
  ): void {
    const config = new BarsExampleTooltipConfig();
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
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

  changeMargin(): void {
    this.margin = {
      top: 36,
      right: 0,
      bottom: 8,
      left: Math.random() * 500,
    };
  }
}
