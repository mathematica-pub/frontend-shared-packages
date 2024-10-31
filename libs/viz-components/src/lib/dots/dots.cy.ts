// ***********************************************************
// Set up Lines component -- can use with Date or numeric values for x axis

import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { XQuantitativeAxisConfig, YQuantitativeAxisConfig } from '../axes';
import { HoverMoveAction } from '../events';
import {
  LinesEventOutput,
  LinesHoverMoveDirective,
  LinesHoverMoveEmitTooltipData,
} from '../lines';
import { QdQnCData, QnQnCData } from '../testing/data/quant-quant-cat-data';
import { HtmlTooltipConfig, VicHtmlTooltipConfigBuilder } from '../tooltips';
import { DotsConfig } from './config/dots-config';

// Cypress will get the tick elements before d3 has set the text value of the elements,
// because d3 creates the elements and sets the text value in a transition).
// This wait time is necessary to ensure that the text value of the tick elements has been set by d3.
const axisTickTextWaitTime = 1000;

const margin = { top: 60, right: 20, bottom: 40, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const dateData = QdQnCData;
const numericData = QnQnCData;
const tooltipYOffset = 60; // need to offset otherwise the hover will be on the tooltip itself rather than svg

// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-lines',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
          side="bottom"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
          side="left"
        ></svg:g>
        <svg:g
          vic-primary-marks-dots
          [config]="linesConfig"
          [vicDotsHoverActions]="hoverActions"
          (vicDotsHoverOutput)="updateTooltipForNewOutput($event)"
        >
          <vic-html-tooltip
            [config]="tooltipConfig$ | async"
            [template]="htmlTooltip"
          ></vic-html-tooltip>
        </svg:g>
      </ng-container>
    </vic-xy-chart>

    <ng-template #htmlTooltip>
      <ng-container *ngIf="tooltipData$ | async as tooltipData">
        <p class="tooltip-text">{{ tooltipData.values.x }}</p>
        <p class="tooltip-text">{{ tooltipData.values.y }}</p>
        <p class="tooltip-text">{{ tooltipData.values.fill }}</p>
        <p class="tooltip-text">{{ tooltipData.values.radius }}</p>
      </ng-container>
    </ng-template>
  `,
  styles: ['.tooltip-text { font-size: 12px; }'],
})
class TestDotsComponent<Datum> {
  @Input() dotsConfig: DotsConfig<Datum>;
  @Input() yQuantitativeAxisConfig: YQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: XQuantitativeAxisConfig<QuantAxisType>;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesEventOutput<Datum>> = new BehaviorSubject<
    LinesEventOutput<Datum>
  >(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: HoverMoveAction<LinesHoverMoveDirective<Datum>>[] = [
    new LinesHoverMoveEmitTooltipData(),
  ];

  updateTooltipForNewOutput(data: LinesEventOutput<Datum>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: LinesEventOutput<Datum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: LinesEventOutput<Datum>): void {
    const config = new VicHtmlTooltipConfigBuilder()
      .size((size) => size.minWidth(100))
      .linesPosition([
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - tooltipYOffset : 0,
        },
      ])
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }

  getYearFromStringDate(dateString: string): number {
    return new Date(dateString).getFullYear();
  }
}
