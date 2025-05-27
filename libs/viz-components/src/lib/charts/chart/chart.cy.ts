import { Component, Input } from '@angular/core';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import {
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXyAxisModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '../../axes';
import {
  BarsConfig,
  BarsEventOutput,
  BarsHoverDirective,
  BarsHoverEmitTooltipData,
  VicBarsConfigBuilder,
  VicBarsModule,
} from '../../bars';
import { EventAction } from '../../events';
import {
  countryFactsData,
  CountryFactsDatum,
} from '../../testing/data/country-area-continent';
import { HtmlTooltipConfig, VicHtmlTooltipModule } from '../../tooltips';
import { VicChartModule } from '../chart.module';
import { VicChartConfigBuilder } from './config/chart-builder';
import { ChartConfig } from './config/chart-config';

const axisTickTextWaitTime = 1000;

// ***********************************************************
// Vertical bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-vertical-bar',
  imports: [
    VicChartModule,
    VicBarsModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
  ],
  template: `
    <button (click)="updateConfig()" id="update-config-button"
      >Update Config</button
    >
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g vic-x-ordinal-axis [config]="xOrdinalAxisConfig"></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g
          vic-primary-marks-bars
          [config]="barsConfig"
          [vicBarsHoverActions]="hoverActions"
          (vicBarsHoverOutput)="updateTooltipForNewOutput($event)"
        >
          <vic-html-tooltip
            [config]="tooltipConfig$ | async"
            [template]="htmlTooltip"
          ></vic-html-tooltip>
        </svg:g>
      </ng-container>
      <ng-template #htmlTooltip>
        <p>{{ (tooltipData$ | async).values.y }}</p>
      </ng-template>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestVerticalBarsComponent {
  @Input() chartConfig: ChartConfig;
  @Input() barsConfig: BarsConfig<CountryFactsDatum, string>;
  @Input() xOrdinalAxisConfig: VicXOrdinalAxisConfig<string>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() updateChartConfig: () => ChartConfig;

  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<CountryFactsDatum, string>> =
    new BehaviorSubject<BarsEventOutput<CountryFactsDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: EventAction<BarsHoverDirective<CountryFactsDatum, string>>[] = [
    new BarsHoverEmitTooltipData(),
  ];

  updateConfig(): void {
    this.chartConfig = this.updateChartConfig();
  }
}

const mountVerticalBarsComponent = (
  chartConfig: ChartConfig,
  barsConfig: BarsConfig<CountryFactsDatum, string>,
  updateChartConfig: () => ChartConfig
): void => {
  const xAxisConfig = new VicXOrdinalAxisConfigBuilder().getConfig();
  const yAxisConfig = new VicYQuantitativeAxisConfigBuilder()
    .ticks((ticks) => ticks.format('.0f'))
    .getConfig();

  const declarations = [TestVerticalBarsComponent];

  cy.mount(TestVerticalBarsComponent, {
    declarations,
    componentProperties: {
      chartConfig,
      barsConfig,
      xOrdinalAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
      updateChartConfig,
    },
  });
};

describe('it correctly scales the chart', () => {
  let barsConfig: BarsConfig<CountryFactsDatum, string>;
  let chartConfig: ChartConfig;
  let updateChartConfig: () => ChartConfig;
  let margin: { top: number; right: number; bottom: number; left: number };
  let height: number;
  let width: number;
  beforeEach(() => {
    barsConfig = undefined;
    margin = { top: 20, right: 20, bottom: 4, left: 40 };
    height = 400;
    width = 600;
  });
  it('resizes the width of the chart if the user provides a new width', () => {
    chartConfig = new VicChartConfigBuilder()
      .margin(margin)
      .height(height)
      .width(width)
      .transitionDuration(0)
      .resize({ useViewbox: false })
      .getConfig();
    barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
      .data(countryFactsData)
      .vertical((bars) =>
        bars
          .y((dimension) => dimension.valueAccessor((d) => d.area))
          .x((dimension) => dimension.valueAccessor((d) => d.country))
      )
      .getConfig();
    updateChartConfig = () => {
      return new VicChartConfigBuilder()
        .margin(margin)
        .height(800)
        .width(width)
        .transitionDuration(0)
        .resize({ useViewbox: false })
        .getConfig();
    };
    mountVerticalBarsComponent(chartConfig, barsConfig, updateChartConfig);
    cy.wait(axisTickTextWaitTime);
    cy.get('svg')
      .should('have.attr', 'width', '600')
      .and('have.attr', 'height', '400');
    cy.get('#update-config-button').click();
    cy.get('svg')
      .should('have.attr', 'width', '600')
      .and('have.attr', 'height', '800');
  });
});
