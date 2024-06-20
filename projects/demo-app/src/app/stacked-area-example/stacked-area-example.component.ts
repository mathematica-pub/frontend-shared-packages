import { Component, OnInit } from '@angular/core';
import {
  HoverMoveEventEffect,
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
  Vic,
  VicElementSpacing,
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
  VicQuantitativeAxisConfig,
  VicStackedAreaConfig,
  VicStackedAreaEventOutput,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedAreaConfig<IndustryUnemploymentDatum, string>;
  xAxisConfig: VicQuantitativeAxisConfig<Date>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
}

class StackedAreaExampleTooltipConfig extends VicHtmlTooltipConfig {
  constructor(config: Partial<VicHtmlTooltipConfig> = {}) {
    super();
    this.size.minWidth = 130;
    Object.assign(this, config);
  }
}

@Component({
  selector: 'app-stacked-area-example',
  templateUrl: './stacked-area-example.component.html',
  styleUrls: ['./stacked-area-example.component.scss'],
})
export class StackedAreaExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-area-example';
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig(new StackedAreaExampleTooltipConfig())
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<
    VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  > = new BehaviorSubject<
    VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  >(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveEffects: HoverMoveEventEffect<
    StackedAreaHoverMoveDirective<IndustryUnemploymentDatum, string>
  >[] = [new StackedAreaHoverMoveEmitTooltipData()];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const xAxisConfig = Vic.axisXQuantitative<Date>({
      tickFormat: '%Y',
    });
    const yAxisConfig = Vic.axisYQuantitative<number>({
      tickFormat: ',.0f',
    });
    const dataConfig = Vic.stackedArea<IndustryUnemploymentDatum, string>({
      data,
      x: Vic.dimensionQuantitativeDate({
        valueAccessor: (d) => d.date,
      }),
      y: Vic.dimensionQuantitativeNumeric({
        valueAccessor: (d) => d.value,
      }),
      categorical: Vic.dimensionCategorical({
        valueAccessor: (d) => d.industry,
      }),
    });
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(
    data: VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(
    output: VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    this.tooltipData.next(output);
  }

  updateTooltipConfig(
    output: VicStackedAreaEventOutput<IndustryUnemploymentDatum, string>
  ): void {
    const config = new StackedAreaExampleTooltipConfig();
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    if (output && output.hoveredDatum !== undefined) {
      config.position.offsetX = output.positionX;
      config.position.offsetY = output.categoryYMin - 5;
      config.show = true;
    } else {
      config.show = false;
      config.origin = undefined;
    }
    this.tooltipConfig.next(config);
  }
}
