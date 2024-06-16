import { Component, Input } from '@angular/core';
import { curveBasis, schemeTableau10 } from 'd3';
import { cy, describe, it } from 'local-cypress';
import {
  Vic,
  VicChartModule,
  VicLinesConfig,
  VicLinesModule,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import {
  QdQnCData,
  QdQnCDatum,
  QnQnCData,
  QnQnCDatum,
} from '../testing/data/quant-quant-cat-data';

const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const chartHeight = 400;
const chartWidth = 600;
const dateData = QdQnCData;
const numericData = QnQnCData;

// ***********************************************************
// Horizontal bar chart component set up
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
        <svg:g vic-data-marks-lines [config]="linesConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestLinesComponent<Datum, QuantAxisType extends number | Date> {
  @Input() linesConfig: VicLinesConfig<Datum>;
  @Input() yQuantitativeAxisConfig: VicQuantitativeAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<QuantAxisType>;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
}

const imports = [
  VicChartModule,
  VicLinesModule,
  VicXQuantitativeAxisModule,
  VicYQuantitativeAxisModule,
  VicXyChartModule,
];

function mountDateLinesComponent(
  linesConfig: VicLinesConfig<QdQnCDatum>
): void {
  const xAxisConfig = Vic.axisXQuantitative({
    tickFormat: '%Y',
  });
  const yAxisConfig = Vic.axisYQuantitative();
  const declarations = [TestLinesComponent<QdQnCDatum, Date>];
  cy.mount(TestLinesComponent<QdQnCDatum, Date>, {
    declarations,
    imports,
    componentProperties: {
      linesConfig: linesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

function mountNumberLinesComponent(
  linesConfig: VicLinesConfig<QnQnCDatum>
): void {
  const xAxisConfig = Vic.axisXQuantitative({
    tickFormat: '.0f',
  });
  const yAxisConfig = Vic.axisYQuantitative();
  const declarations = [TestLinesComponent<QnQnCDatum, number>];
  cy.mount(TestLinesComponent<QnQnCDatum, number>, {
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
// Creating the correct lines
// ***********************************************************
describe('it creates the correct lines', () => {
  describe('when the x axis values are Dates', () => {
    it('should draw the correct number of lines', () => {
      const linesConfig = Vic.lines<QdQnCDatum>({
        data: dateData,
        x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
          valueAccessor: (d) => d.year,
        }),
        y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
          valueAccessor: (d) => d.population,
        }),
        categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
          valueAccessor: (d) => d.continent,
        }),
      });
      mountDateLinesComponent(linesConfig);
      cy.get('.vic-line').should('have.length', 6);
    });
  });
  describe('when the x axis values are a Numbers', () => {
    it('should draw the correct number of lines', () => {
      const linesConfig = Vic.lines<QnQnCDatum>({
        data: numericData,
        x: Vic.dimensionQuantitativeNumeric({
          valueAccessor: (d) => d.year,
          includeZeroInDomain: false,
        }),
        y: Vic.dimensionQuantitativeNumeric({
          valueAccessor: (d) => d.population,
        }),
        categorical: Vic.dimensionCategorical<QnQnCDatum, string>({
          valueAccessor: (d) => d.continent,
        }),
      });
      mountNumberLinesComponent(linesConfig);
      cy.get('.vic-line').should('have.length', 6);
    });
  });
});

// ***********************************************************
// Tests of various config properties
// ***********************************************************
describe('it creates lines with the correct properties per config', () => {
  // More rigorous testing of categorical dimension in categorical tests
  it('draws lines with the correct colors', () => {
    const linesConfig = Vic.lines<QdQnCDatum>({
      data: dateData,
      x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
        valueAccessor: (d) => d.year,
      }),
      y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
        valueAccessor: (d) => d.population,
      }),
      categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
        valueAccessor: (d) => d.continent,
      }),
    });
    mountDateLinesComponent(linesConfig);
    cy.get('.vic-line').each(($line, i) => {
      cy.wrap($line).should('have.attr', 'stroke', schemeTableau10[i]);
    });
  });
  it('draws the correct number of lines if a user provides a custom curve function', () => {
    const linesConfig = Vic.lines<QdQnCDatum>({
      data: dateData,
      x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
        valueAccessor: (d) => d.year,
      }),
      y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
        valueAccessor: (d) => d.population,
      }),
      categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
        valueAccessor: (d) => d.continent,
      }),
      curve: curveBasis,
    });
    mountDateLinesComponent(linesConfig);
    cy.get('.vic-line').should('have.length', 6);
  });
  describe('pointMarkers', () => {
    it('draws the correct number of point markers', () => {
      const linesConfig = Vic.lines<QdQnCDatum>({
        data: dateData,
        x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
          valueAccessor: (d) => d.year,
        }),
        y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
          valueAccessor: (d) => d.population,
        }),
        categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
          valueAccessor: (d) => d.continent,
        }),
        pointMarkers: Vic.pointMarkers(),
      });
      mountDateLinesComponent(linesConfig);
      cy.get('.vic-point-marker').should('have.length', 24);
    });
    it('draws point markers with the correct radius - user provides custom radius', () => {
      const linesConfig = Vic.lines<QdQnCDatum>({
        data: dateData,
        x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
          valueAccessor: (d) => d.year,
        }),
        y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
          valueAccessor: (d) => d.population,
        }),
        categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
          valueAccessor: (d) => d.continent,
        }),
        pointMarkers: Vic.pointMarkers({ radius: 4 }),
      });
      mountDateLinesComponent(linesConfig);
      cy.get('.vic-point-marker').each(($pointMarker) => {
        cy.wrap($pointMarker).should('have.attr', 'r', '4');
      });
    });
  });
});
