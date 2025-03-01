import { Component, Input } from '@angular/core';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import {
  VicXQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisConfigBuilder,
} from '..';
import {
  ChartConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicXyChartModule,
} from '../../charts';
import {
  LinesConfig,
  VicLinesConfigBuilder,
  VicLinesModule,
} from '../../lines';
import {
  ContinentPopulationNumYearData,
  ContinentPopulationNumYearDatum,
} from '../../testing/data/continent-population-year-data';
import { VicXyBackgroundModule } from '../../xy-background';
import { VicXQuantitativeAxisConfig } from '../x-quantitative/x-quantitative-axis-config';
import { VicXQuantitativeAxisModule } from '../x-quantitative/x-quantitative-axis.module';
import { VicYQuantitativeAxisConfig } from '../y-quantitative-axis/y-quantitative-axis-config';
import { VicYQuantitativeAxisModule } from '../y-quantitative-axis/y-quantitative-axis.module';

// Cypress will get the tick elements before d3 has set the text value of the elements,
// because d3 creates the elements and sets the text value in a transition).
// This wait time is necessary to ensure that the text value of the tick elements has been set by d3.
const axisTickTextWaitTime = 1000;

const margin = { top: 60, right: 20, bottom: 40, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const data = ContinentPopulationNumYearData;
@Component({
  selector: 'vic-test-axis-labels',
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
})
class TestAxisLabelsComponent<Datum> {
  @Input() linesConfig: LinesConfig<Datum>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .height(chartHeight)
    .width(chartWidth)
    .margin(margin)
    .resize({ height: false, useViewbox: false })
    .getConfig();
}

const imports = [
  VicChartModule,
  VicLinesModule,
  VicXQuantitativeAxisModule,
  VicYQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
];

function mountAxisLabelsComponent(
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
  const declarations = [
    TestAxisLabelsComponent<ContinentPopulationNumYearDatum>,
  ];
  cy.mount(TestAxisLabelsComponent<ContinentPopulationNumYearDatum>, {
    declarations,
    imports,
    componentProperties: {
      linesConfig: linesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

// ***********************************************************
// Test that axis labels are visible when various basic config values are used - no custom offsets
// ***********************************************************
describe('It creates axis labels that are visible when default values are used', () => {
  beforeEach(() => {
    const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .label((label) => label.text('Year'))
      .getConfig();
    const yAxisConfig = new VicYQuantitativeAxisConfigBuilder<number>()
      .label((label) => label.text('Population'))
      .ticks((ticks) => ticks.format('.2s'))
      .getConfig();
    mountAxisLabelsComponent(xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
  });
  it('should have visible x and y axis labels that are centered on axes', () => {
    cy.get('.vic-axis-x-quantitative .vic-axis-label').should(
      'have.text',
      'Year'
    );
    cy.get('.vic-axis-y-quantitative .vic-axis-label').should(
      'have.text',
      'Population'
    );
    cy.get<SVGGElement>('.vic-xy-background').then((chartBackground) => {
      const chartRect = chartBackground[0].getBBox();
      cy.get<SVGTextElement>('.vic-axis-x-quantitative .vic-axis-label').then(
        (xAxisLabel) => {
          const textRect = xAxisLabel[0].getBoundingClientRect();
          expect(
            textRect.left + (textRect.right - textRect.left) / 2
          ).to.be.closeTo(margin.left + chartRect.width / 2, 4);
        }
      );
      cy.get<SVGTextElement>('.vic-axis-y-quantitative .vic-axis-label').then(
        (yAxisLabel) => {
          const textRect = yAxisLabel[0].getBoundingClientRect();
          expect(
            textRect.top + (textRect.bottom - textRect.top) / 2
          ).to.be.closeTo(margin.top + chartRect.height / 2, 4);
        }
      );
    });
  });
});

describe('It creates axis labels that correctly positioned when positions are start', () => {
  beforeEach(() => {
    const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .label((label) => label.text('Year').position('start'))
      .getConfig();
    const yAxisConfig = new VicYQuantitativeAxisConfigBuilder<number>()
      .label((label) => label.text('Population').position('start'))
      .ticks((ticks) => ticks.format('.2s'))
      .getConfig();
    mountAxisLabelsComponent(xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
  });
  it('should have visible x and y axis labels that are at the leading edge of axes', () => {
    cy.get<SVGGElement>('.vic-xy-background').then(() => {
      cy.get<SVGTextElement>('.vic-axis-x-quantitative .vic-axis-label').then(
        (xAxisLabel) => {
          const textRect = xAxisLabel[0].getBoundingClientRect();
          expect(textRect.left).to.be.closeTo(margin.left, 4);
        }
      );
      cy.get<SVGTextElement>('.vic-axis-y-quantitative .vic-axis-label').then(
        (yAxisLabel) => {
          const textRect = yAxisLabel[0].getBoundingClientRect();
          expect(textRect.bottom).to.be.closeTo(margin.top, 4);
        }
      );
    });
  });
});

describe('It creates axis labels that are correctly positioned when positions are end', () => {
  beforeEach(() => {
    const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .label((label) => label.text('Year').position('end'))
      .getConfig();
    const yAxisConfig = new VicYQuantitativeAxisConfigBuilder<number>()
      .label((label) => label.text('Population').position('end'))
      .ticks((ticks) => ticks.format('.2s'))
      .getConfig();
    mountAxisLabelsComponent(xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
  });
  it('should have visible x and y axis labels that are at the trailing edge of axes', () => {
    cy.get<SVGGElement>('.vic-xy-background').then((chartBackground) => {
      const chartRect = chartBackground[0].getBoundingClientRect();
      cy.get<SVGTextElement>('.vic-axis-x-quantitative .vic-axis-label').then(
        (xAxisLabel) => {
          const textRect = xAxisLabel[0].getBoundingClientRect();
          expect(textRect.right).to.be.closeTo(chartRect.right, 4);
        }
      );
      cy.get<SVGTextElement>('.vic-axis-y-quantitative .vic-axis-label').then(
        (yAxisLabel) => {
          const textRect = yAxisLabel[0].getBoundingClientRect();
          expect(textRect.bottom).to.be.closeTo(chartRect.bottom, 4);
        }
      );
    });
  });
});
