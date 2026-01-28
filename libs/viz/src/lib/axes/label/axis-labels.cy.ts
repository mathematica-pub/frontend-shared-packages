/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import {
  ChartConfig,
  LinesConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@mathstack/viz';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import {
  ContinentPopulationNumYearData,
  ContinentPopulationNumYearDatum,
} from '../../testing/data/continent-population-year-data';

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
  imports: [
    VicChartModule,
    VicLinesModule,
    VicXyAxisModule,
    VicXyBackgroundModule,
  ],
})
class TestAxisLabelsComponent<Datum> {
  @Input() linesConfig: LinesConfig<Datum>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .maxHeight(chartHeight)
    .maxWidth(chartWidth)
    .margin(margin)
    .scalingStrategy('responsive-width')
    .getConfig();
}

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

  cy.mount(TestAxisLabelsComponent<ContinentPopulationNumYearDatum>, {
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

// ***********************************************************
// Test that axis labels correctly wrap - brittle tests but better than nothing
// ***********************************************************
describe('It creates axis labels that are visible when default values are used', () => {
  const wrapWidth = 160;
  beforeEach(() => {
    const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .label((label) =>
        label
          .text('Years in which Mathematica operated')
          .wrap((wrap) => wrap.width(wrapWidth))
      )
      .getConfig();
    const yAxisConfig = new VicYQuantitativeAxisConfigBuilder<number>()
      .label((label) =>
        label
          .text(
            'Number of spectacular components tests Mathematica has written as part of frontend work'
          )
          .wrap((wrap) => wrap.width(wrapWidth))
      )
      .ticks((ticks) => ticks.format('.2s'))
      .getConfig();
    mountAxisLabelsComponent(xAxisConfig, yAxisConfig);
    cy.wait(axisTickTextWaitTime);
  });
  it('should have visible x and y axis labels that are correctly wrapped and centered on axes', () => {
    // Ensure that there are multiple tspan elements created for each label.
    cy.get('.vic-axis-x-quantitative .vic-axis-label tspan').should(
      'have.length',
      2
    );
    cy.get('.vic-axis-y-quantitative .vic-axis-label tspan').should(
      'have.length',
      3
    );

    // Ensure each line is offset vertically.
    cy.get('.vic-axis-x-quantitative .vic-axis-label tspan').then((spans) => {
      const dyValues = Array.from(spans).map((span) => span.getAttribute('dy'));
      expect(new Set(dyValues).size).to.equal(2);
    });
    cy.get('.vic-axis-y-quantitative .vic-axis-label tspan').then((spans) => {
      const dyValues = Array.from(spans).map((span) => span.getAttribute('dy'));
      expect(new Set(dyValues).size).to.equal(3);
    });

    // dy values are evenly spaced
    cy.get('.vic-axis-y-quantitative .vic-axis-label tspan').then((spans) => {
      const dyValues = Array.from(spans).map((span) => span.getAttribute('dy'));
      const differences = dyValues.reduce((acc, val, i) => {
        if (i === 0) return acc;
        const diff =
          parseFloat(val || '0') - parseFloat(dyValues[i - 1] || '0');
        const diffRoundedToPointOne = Math.round(diff * 10) / 10;
        acc.push(diffRoundedToPointOne);
        return acc;
      }, []);
      expect(new Set(differences).size).to.equal(1);
    });

    // Ensure that the overall width of the label is less than or equal to the wrap width.
    cy.get('.vic-axis-x-quantitative .vic-axis-label')
      .invoke('width')
      .should('be.lte', wrapWidth);
    cy.get('.vic-axis-y-quantitative .vic-axis-label')
      .invoke('width')
      .should('be.lte', wrapWidth);

    // Ensure that the label text is split across multiple lines.
    cy.get('.vic-axis-x-quantitative .vic-axis-label tspan').each(($span) => {
      expect($span.text().length).to.be.greaterThan(0);
    });
    cy.get('.vic-axis-y-quantitative .vic-axis-label tspan').each(($span) => {
      expect($span.text().length).to.be.greaterThan(0);
    });

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
