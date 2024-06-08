import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { format } from 'd3';
import { VicOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/ordinal/ordinal-axis.config';
import { VicQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/quantitative/quantitative-axis.config';
import { BarsHoverMoveDirective } from 'projects/viz-components/src/lib/bars/bars-hover-move.directive';
import { VicBarsEventOutput } from 'projects/viz-components/src/lib/bars/bars-tooltip-data';
import { vicBarsLabels } from 'projects/viz-components/src/lib/bars/config/bars-labels';
import {
  VicBarsConfig,
  vicHorizontalBars,
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
  vicXQuantitativeAxis,
  vicYOrdinalAxis,
  vicYQuantitativeAxis,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicBarsConfig<MetroUnemploymentDatum, string>;
  xAxisConfig: VicOrdinalAxisConfig<string> | VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicOrdinalAxisConfig<string> | VicQuantitativeAxisConfig<number>;
}

class BarsExampleTooltipConfig extends VicHtmlTooltipConfig {
  constructor(config: Partial<VicHtmlTooltipConfig> = {}) {
    super();
    this.size.minWidth = 130;
    Object.assign(this, config);
  }
}

enum Orientation {
  vertical = 'vertical',
  horizontal = 'horizontal',
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
  orientation: BehaviorSubject<keyof typeof Orientation> = new BehaviorSubject(
    Orientation.horizontal as keyof typeof Orientation
  );
  orientation$ = this.orientation.asObservable();
  Orientation = Orientation;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const data$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x)
    );

    this.vm$ = combineLatest([data$, this.orientation$]).pipe(
      map(([data, orientation]) => this.getViewModel(data, orientation))
    );
  }

  getViewModel(
    data: MetroUnemploymentDatum[],
    orientation: keyof typeof Orientation
  ): ViewModel {
    const filteredData = data.filter(
      (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
    );
    const xAxisConfig =
      orientation === Orientation.horizontal
        ? vicXQuantitativeAxis<number>({
            tickFormat: '.0f',
          })
        : vicXOrdinalAxis<string>();
    const yAxisConfig =
      orientation === Orientation.horizontal
        ? vicYOrdinalAxis<string>()
        : vicYQuantitativeAxis<number>({
            tickFormat: '.0f',
          });
    const barsGenerator =
      orientation === Orientation.horizontal
        ? vicHorizontalBars
        : vicVerticalBars;
    const dataConfig = barsGenerator<MetroUnemploymentDatum, string>({
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
        valueAccessor: (d) => {
          console.log(d);
          return d.division;
        },
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

  updateOrientation(value: keyof typeof Orientation): void {
    this.orientation.next(value);
  }
}
