import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { format } from 'd3';
import {
  BarsHoverMoveDirective,
  BarsHoverMoveEmitTooltipData,
  HoverMoveEventEffect,
  VicAxisConfig,
  VicBarsConfig,
  VicBarsEventOutput,
  VicBarsLabelsConfig,
  VicBarsModule,
  VicChartModule,
  VicElementSpacing,
  VicHorizontalBarsDimensionsConfig,
  VicHtmlTooltipConfig,
  VicHtmlTooltipModule,
  VicHtmlTooltipOffsetFromOriginPosition,
  VicPixelDomainPaddingConfig,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { MetroUnemploymentDatum } from '../../core/models/data';
import { DataService } from '../../core/services/data.service';
import { ExampleDisplayComponent } from '../../example-display/example-display.component';

interface ViewModel {
  dataConfig: VicBarsConfig<MetroUnemploymentDatum>;
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
  standalone: true,
  imports: [
    CommonModule,
    ExampleDisplayComponent,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYOrdinalAxisModule,
    VicXQuantitativeAxisModule,
    VicHtmlTooltipModule,
    MatButtonModule,
  ],
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
  tooltipData: BehaviorSubject<VicBarsEventOutput<MetroUnemploymentDatum>> =
    new BehaviorSubject<VicBarsEventOutput<MetroUnemploymentDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveEffects: HoverMoveEventEffect<
    BarsHoverMoveDirective<MetroUnemploymentDatum>
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
    const xAxisConfig = new VicAxisConfig();
    xAxisConfig.tickFormat = '.0f';
    const yAxisConfig = new VicAxisConfig();
    const dataConfig = new VicBarsConfig<MetroUnemploymentDatum>();
    dataConfig.labels = new VicBarsLabelsConfig();
    dataConfig.labels.display = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataConfig.quantitative.valueFormat = (d: any) => {
      const label =
        d.value === undefined || d.value === null
          ? 'N/A'
          : format('.1f')(d.value);
      return d.value > 8 ? `${label}*` : label;
    };
    dataConfig.data = filteredData;
    dataConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    dataConfig.ordinal.valueAccessor = (d) => d.division;
    dataConfig.quantitative.valueAccessor = (d) => d.value;
    dataConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig();
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(
    data: VicBarsEventOutput<MetroUnemploymentDatum>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: VicBarsEventOutput<MetroUnemploymentDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: VicBarsEventOutput<MetroUnemploymentDatum>): void {
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
