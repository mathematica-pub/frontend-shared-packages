/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import {
  BarsConfig,
  LinesConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import {
  ContinentPopulationNumYearData,
  ContinentPopulationNumYearDatum,
} from '../../testing/data/continent-population-year-data';

const axisTickTextWaitTime = 2000;

const margin = { top: 60, right: 20, bottom: 40, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const data = ContinentPopulationNumYearData;

@Component({
  selector: 'vic-test-zero-axis-lines',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g vic-xy-background></svg:g>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-primary-marks-lines [config]="linesConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
  imports: [
    VicChartModule,
    VicLinesModule,
    VicXyAxisModule,
    VicXyBackgroundModule,
  ],
})
class TestZeroAxisLinesComponent<Datum> {
  @Input() linesConfig: LinesConfig<Datum>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  chartConfig = new VicChartConfigBuilder()
    .margin(margin)
    .height(chartHeight)
    .width(chartWidth)
    .getConfig();
}

function mountZeroAxisLinesComponent(
  data: ContinentPopulationNumYearDatum[],
  xAxisConfig: VicXQuantitativeAxisConfig<number>,
  yAxisConfig: VicYQuantitativeAxisConfig<number>
): void {
  const linesConfig =
    new VicLinesConfigBuilder<ContinentPopulationNumYearDatum>()
      .data(data)
      .xNumeric((dimension) =>
        dimension.valueAccessor((d) => d.year).includeZeroInDomain(false)
      )
      .y((y) => y.valueAccessor((d) => d.population))
      .stroke((stroke) =>
        stroke.color((color) => color.valueAccessor((d) => d.continent))
      )
      .getConfig();
  cy.mount(TestZeroAxisLinesComponent<ContinentPopulationNumYearDatum>, {
    componentProperties: {
      linesConfig: linesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

// ***********************************************************
// Test the positioning of the domain lines on the x and y axes - line chart
// ***********************************************************
describe('Domain lines positioning, two quant dimensions', () => {
  let xAxisConfig: VicXQuantitativeAxisConfig<number>;
  let yAxisConfig: VicYQuantitativeAxisConfig<number>;
  beforeEach(() => {
    xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
    yAxisConfig = new VicYQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.2s'))
      .getConfig();
  });
  it('should have visible x and y domains at the edges of the charts when data is all positive', () => {
    mountZeroAxisLinesComponent(data, xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
    cy.get<SVGGElement>('.vic-xy-background').then((chartBackground) => {
      const chartRect = chartBackground[0].getBoundingClientRect();
      cy.get<SVGTextElement>('.vic-axis-x-quantitative .domain').then(
        (domain) => {
          const domainRect = domain[0].getBoundingClientRect();
          expect(domainRect.top).to.be.closeTo(chartRect.bottom, 2);
        }
      );
      cy.get<SVGTextElement>('.vic-axis-y-quantitative .domain').then(
        (domain) => {
          const domainRect = domain[0].getBoundingClientRect();
          expect(domainRect.right).to.be.closeTo(chartRect.left, 2);
        }
      );
    });
  });
  it('should have an x domain at the height of the 0 tick on the y-axis when there are positive and negative values', () => {
    mountZeroAxisLinesComponent(
      data.map((d) => ({ ...d, population: d.population - 1000000000 })),
      xAxisConfig,
      yAxisConfig
    );
    cy.wait(axisTickTextWaitTime);
    cy.get<SVGGElement>('.vic-axis-y-quantitative .tick')
      .filter(':contains("0.0")')
      .then((tick) => {
        const line = tick.find('line');
        const lineRect = line[0].getBoundingClientRect();
        cy.get<SVGTextElement>('.vic-axis-x-quantitative .domain').then(
          (domain) => {
            const domainRect = domain[0].getBoundingClientRect();
            expect(domainRect.top).to.be.closeTo(lineRect.top, 2);
          }
        );
      });
  });
});

@Component({
  selector: 'vic-test-zero-axis-horizontal-bars',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g vic-xy-background></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-y-ordinal-axis [config]="yOrdinalAxisConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
  imports: [
    VicChartModule,
    VicBarsModule,
    VicXyAxisModule,
    VicXyBackgroundModule,
  ],
})
class TestZeroAxisHorizontalBarsComponent<Datum> {
  @Input() barsConfig: BarsConfig<Datum, string>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  @Input() yOrdinalAxisConfig: VicYOrdinalAxisConfig<string>;
  chartConfig = new VicChartConfigBuilder()
    .margin(margin)
    .height(chartHeight)
    .width(chartWidth)
    .getConfig();
}

function mountZeroAxisHorizontalBarsComponent(
  data: ContinentPopulationNumYearDatum[],
  xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>,
  yOrdinalAxisConfig: VicYOrdinalAxisConfig<string>
): void {
  const barsConfig = new VicBarsConfigBuilder<
    ContinentPopulationNumYearDatum,
    string
  >()
    .data(data)
    .horizontal((bars) =>
      bars
        .x((x) => x.valueAccessor((d) => d.population))
        .y((y) => y.valueAccessor((d) => d.continent))
    )
    .getConfig();
  cy.mount(
    TestZeroAxisHorizontalBarsComponent<ContinentPopulationNumYearDatum>,
    {
      componentProperties: {
        barsConfig,
        xQuantitativeAxisConfig,
        yOrdinalAxisConfig,
      },
    }
  );
}

// ***********************************************************
// Test the positioning of the domain lines on the x and y axes - bar chart - horizontal
// ***********************************************************
describe('Domain lines positioning, one quant, one ordinal dimension - horizontal bar chart', () => {
  let xAxisConfig: VicXQuantitativeAxisConfig<number>;
  let yAxisConfig: VicYOrdinalAxisConfig<string>;
  let dataForYear = data.filter((d) => d.year === 2024);
  beforeEach(() => {
    xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f').count(5))
      .getConfig();
    yAxisConfig = new VicYOrdinalAxisConfigBuilder<string>().getConfig();
  });
  it('should have visible x domain at the bottom of the chart and no y domain when data is all positive', () => {
    mountZeroAxisHorizontalBarsComponent(dataForYear, xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
    cy.get<SVGGElement>('.vic-xy-background').then((chartBackground) => {
      const chartRect = chartBackground[0].getBoundingClientRect();
      cy.get<SVGTextElement>('.vic-axis-x-quantitative .domain').then(
        (domain) => {
          const domainRect = domain[0].getBoundingClientRect();
          expect(domainRect.top).to.be.closeTo(chartRect.bottom, 2);
        }
      );
      // expect '.vic-axis-y-ordinal .domain' not to exist
      cy.get('.vic-axis-y-ordinal .domain').should('not.exist');
    });
  });
  it('should have visible y domain at bottom of chart and an x domain in the middle of the chart when data is pos and neg', () => {
    dataForYear = dataForYear.map((d) => ({
      ...d,
      population: d.population - 1000000000,
    }));
    mountZeroAxisHorizontalBarsComponent(dataForYear, xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
    cy.get<SVGGElement>('.vic-xy-background').then((chartBackground) => {
      const chartRect = chartBackground[0].getBoundingClientRect();
      cy.get<SVGTextElement>('.vic-axis-x-quantitative .domain').then(
        (domain) => {
          const domainRect = domain[0].getBoundingClientRect();
          expect(domainRect.top).to.be.closeTo(chartRect.bottom, 2);
        }
      );
    });
    cy.get<SVGGElement>('.vic-axis-x-quantitative .tick')
      .filter(':contains("0")')
      .then((tick) => {
        const line = tick.find('line');
        const lineRect = line[0].getBoundingClientRect();
        cy.get<SVGTextElement>('.vic-axis-y-ordinal .domain').then((domain) => {
          const domainRect = domain[0].getBoundingClientRect();
          expect(domainRect.left).to.be.closeTo(lineRect.left, 2);
        });
      });
  });
});

@Component({
  selector: 'vic-test-zero-axis-vertical-bars',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g vic-xy-background></svg:g>
        <svg:g vic-x-ordinal-axis [config]="xOrdinalAxisConfig"></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
  imports: [
    VicChartModule,
    VicBarsModule,
    VicXyAxisModule,
    VicXyBackgroundModule,
  ],
})
class TestZeroAxisVerticalBarsComponent<Datum> {
  @Input() barsConfig: BarsConfig<Datum, string>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xOrdinalAxisConfig: VicXOrdinalAxisConfig<string>;
  chartConfig = new VicChartConfigBuilder()
    .margin(margin)
    .height(chartHeight)
    .width(chartWidth)
    .getConfig();
}

function mountZeroAxisVerticalBarsComponent(
  data: ContinentPopulationNumYearDatum[],
  xOrdinalAxisConfig: VicXOrdinalAxisConfig<string>,
  yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>
): void {
  const barsConfig = new VicBarsConfigBuilder<
    ContinentPopulationNumYearDatum,
    string
  >()
    .data(data)
    .vertical((bars) =>
      bars
        .x((x) => x.valueAccessor((d) => d.continent))
        .y((y) => y.valueAccessor((d) => d.population))
    )
    .getConfig();

  cy.mount(TestZeroAxisVerticalBarsComponent<ContinentPopulationNumYearDatum>, {
    componentProperties: {
      barsConfig,
      yQuantitativeAxisConfig,
      xOrdinalAxisConfig,
    },
  });
}

// ***********************************************************
// Test the positioning of the domain lines on the x and y axes - bar chart - vertical
// ***********************************************************
describe('Domain lines positioning, one quant, one ordinal dimension - vertical bar chart', () => {
  let xAxisConfig: VicXOrdinalAxisConfig<string>;
  let yAxisConfig: VicYQuantitativeAxisConfig<number>;
  let dataForYear = data.filter((d) => d.year === 2024);
  beforeEach(() => {
    xAxisConfig = new VicXOrdinalAxisConfigBuilder<string>().getConfig();
    yAxisConfig = new VicYQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f').count(5))
      .getConfig();
  });
  it('should have visible y domain at left of chart and a x domain in the middle of the chart when data is pos and neg - vertical bar chart', () => {
    dataForYear = dataForYear.map((d) => ({
      ...d,
      population: d.population - 1000000000,
    }));
    mountZeroAxisVerticalBarsComponent(dataForYear, xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
    cy.get<SVGGElement>('.vic-xy-background').then((chartBackground) => {
      const chartRect = chartBackground[0].getBoundingClientRect();
      cy.get<SVGTextElement>('.vic-axis-y-quantitative .domain').then(
        (domain) => {
          const domainRect = domain[0].getBoundingClientRect();
          expect(domainRect.right).to.be.closeTo(chartRect.left, 2);
        }
      );
    });
    cy.get<SVGGElement>('.vic-axis-y-quantitative .tick')
      .filter(':contains("0")')
      .then((tick) => {
        const line = tick.find('line');
        const lineRect = line[0].getBoundingClientRect();
        cy.get<SVGTextElement>('.vic-axis-x-ordinal .domain').then((domain) => {
          const domainRect = domain[0].getBoundingClientRect();
          expect(domainRect.top).to.be.closeTo(lineRect.top, 2);
        });
      });
  });
});
