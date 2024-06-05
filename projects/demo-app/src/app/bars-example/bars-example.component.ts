import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { format } from 'd3';
import { VicOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/ordinal/ordinal-axis.config';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis.config';
import { BarsHoverMoveDirective } from 'projects/viz-components/src/lib/bars/bars-hover-move.directive';
import { VicBarsEventOutput } from 'projects/viz-components/src/lib/bars/bars-tooltip-data';
import { vicBarsLabels } from 'projects/viz-components/src/lib/bars/config/bars-labels';
import {
  VicBarsConfig,
  vicVerticalBars,
} from 'projects/viz-components/src/lib/bars/config/bars.config';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { vicCategoricalDimension } from 'projects/viz-components/src/lib/data-dimensions/categorical-dimension';
import { vicPixelDomainPadding } from 'projects/viz-components/src/lib/data-dimensions/domain-padding/pixel-padding';
import { vicQuantitativeDimension } from 'projects/viz-components/src/lib/data-dimensions/quantitative-dimension';
import { HoverMoveEventEffect } from 'projects/viz-components/src/lib/events/effect';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import {
  BarsHoverMoveEmitTooltipData,
  vicOrdinalDimension,
  vicXOrdinalAxis,
  vicYQuantitativeAxis,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicBarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig: VicOrdinalAxisConfig<string>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
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
    const xAxisConfig = vicXOrdinalAxis<number>();
    const yAxisConfig = vicYQuantitativeAxis({
      tickFormat: '.0f',
    });
    const dataConfig = vicVerticalBars<MetroUnemploymentDatum, string>({
      data: filteredData,
      quantitative: vicQuantitativeDimension<MetroUnemploymentDatum>({
        valueAccessor: (d) => d.value,
        valueFormat: (d) => this.getQuantitativeValueFormat(d),
        domainPadding: vicPixelDomainPadding(),
      }),
      categorical: vicCategoricalDimension<MetroUnemploymentDatum, string>({
        range: ['slategray'],
      }),
      ordinal: vicOrdinalDimension<MetroUnemploymentDatum, string>({
        valueAccessor: (d) => d.division,
      }),
      labels: vicBarsLabels({
        display: true,
      }),
    });
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  getQuantitativeValueFormat(d: MetroUnemploymentDatum): string {
    const label =
      d.value === undefined || d.value === null
        ? 'N/A'
        : format('.1f')(d.value);
    return d.value > 8 ? `${label}*` : label;
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
      config.position.offsetY = data.positionY - 4;
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
