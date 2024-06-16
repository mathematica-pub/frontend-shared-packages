import { Component, Input } from '@angular/core';
import { curveBasis, schemeTableau10 } from 'd3';
import { cy, describe, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
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
describe('it creates the correct lines - x axis values are Dates', () => {
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
    const categories = [];
    cy.get('.vic-line')
      .each(($lines) => {
        categories.push($lines.attr('category'));
      })
      .then(() => {
        expect(categories).to.have.members([
          ...new Set(dateData.map((d) => d.continent)),
        ]);
      });
  });
  it('handles the case when a user inputs data with null values for y axis', () => {
    const testData = cloneDeep(dateData);
    testData[2].population = null;
    const markersCounts = testData.reduce((acc, d) => {
      if (!acc[d.continent]) {
        acc[d.continent] = { expect: 0, actual: 0 };
      }
      if (d.population !== null) {
        acc[d.continent].expect += 1;
      }
      return acc;
    }, {});
    const linesConfig = Vic.lines<QdQnCDatum>({
      data: testData,
      x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
        valueAccessor: (d) => d.year,
      }),
      y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
        valueAccessor: (d) => d.population,
      }),
      categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
        valueAccessor: (d) => d.continent,
      }),
      pointMarkers: Vic.pointMarkers({ class: 'test-point-marker' }),
    });
    mountDateLinesComponent(linesConfig);
    cy.get('.test-point-marker')
      .each(($pointMarker) => {
        const category = $pointMarker.attr('category');
        markersCounts[category].actual += 1;
      })
      .then(() => {
        Object.keys(markersCounts).forEach((key) => {
          expect(markersCounts[key].expect).to.equal(markersCounts[key].actual);
        });
      });
  });
  // Example situation for the below: the API returns data and we think everything is a number but...it's not
  it('handles the case when a user inputs data with y axis value of the wrong type', () => {
    const testData = cloneDeep(dateData);
    testData[2].population = 'hello';
    const markersCounts = testData.reduce((acc, d) => {
      if (!acc[d.continent]) {
        acc[d.continent] = { expect: 0, actual: 0 };
      }
      if (d.population !== 'hello') {
        acc[d.continent].expect += 1;
      }
      return acc;
    }, {});
    const linesConfig = Vic.lines<QdQnCDatum>({
      data: testData,
      x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
        valueAccessor: (d) => d.year,
      }),
      y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
        valueAccessor: (d) => d.population,
      }),
      categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
        valueAccessor: (d) => d.continent,
      }),
      pointMarkers: Vic.pointMarkers({ class: 'test-point-marker' }),
    });
    mountDateLinesComponent(linesConfig);
    cy.get('.test-point-marker')
      .each(($pointMarker) => {
        const category = $pointMarker.attr('category');
        markersCounts[category].actual += 1;
      })
      .then(() => {
        Object.keys(markersCounts).forEach((key) => {
          expect(markersCounts[key].expect).to.equal(markersCounts[key].actual);
        });
      });
  });
  // Example situation for the below: the API returns data and we think everything is a number but...it's not
  it('handles the case when a user inputs data with x axis value of the wrong type', () => {
    const testData = cloneDeep(dateData);
    testData[6].year = 'hello';
    const markersCounts = testData.reduce((acc, d) => {
      if (!acc[d.continent]) {
        acc[d.continent] = { expect: 0, actual: 0 };
      }
      if (d.year !== 'hello') {
        acc[d.continent].expect += 1;
      }
      return acc;
    }, {});
    const linesConfig = Vic.lines<QdQnCDatum>({
      data: testData,
      x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
        valueAccessor: (d) => d.year,
      }),
      y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
        valueAccessor: (d) => d.population,
      }),
      categorical: Vic.dimensionCategorical<QdQnCDatum, string>({
        valueAccessor: (d) => d.continent,
      }),
      pointMarkers: Vic.pointMarkers({ class: 'test-point-marker' }),
    });
    mountDateLinesComponent(linesConfig);
    cy.get('.test-point-marker')
      .each(($pointMarker) => {
        const category = $pointMarker.attr('category');
        markersCounts[category].actual += 1;
      })
      .then(() => {
        Object.keys(markersCounts).forEach((key) => {
          expect(markersCounts[key].expect).to.equal(markersCounts[key].actual);
        });
      });
  });
});
describe('it creates the correct lines - x axis values are Numbers', () => {
  it('should draw the correct number of lines, one for each category', () => {
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
    const categories = [];
    cy.get('.vic-line')
      .each(($lines) => {
        categories.push($lines.attr('category'));
      })
      .then(() => {
        expect(categories).to.have.members([
          ...new Set(numericData.map((d) => d.continent)),
        ]);
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
    const markerClass = 'test-point-marker';
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
        pointMarkers: Vic.pointMarkers({ class: markerClass }),
      });
      mountDateLinesComponent(linesConfig);
      cy.get(`.${markerClass}`).should('have.length', 24);
    });
    it('draws point markers with the correct radius - user provides custom radius', () => {
      const markerClass = 'test-point-marker';
      const radius = 4;
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
        pointMarkers: Vic.pointMarkers({
          radius,
          class: markerClass,
        }),
      });
      mountDateLinesComponent(linesConfig);
      cy.get(`.${markerClass}`).each(($pointMarker) => {
        cy.wrap($pointMarker).should('have.attr', 'r', radius.toString());
      });
    });
  });
  describe('stroke', () => {
    it('draws lines with the correct properties', () => {
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
        stroke: Vic.stroke({
          width: 3,
          opacity: 0.5,
          linecap: 'square',
          linejoin: 'miter',
        }),
      });
      mountDateLinesComponent(linesConfig);
      cy.get('.vic-lines-g').should('have.attr', 'stroke-width', '3');
      cy.get('.vic-lines-g').should('have.attr', 'stroke-opacity', '0.5');
      cy.get('.vic-lines-g').should('have.attr', 'stroke-linecap', 'square');
      cy.get('.vic-lines-g').should('have.attr', 'stroke-linejoin', 'miter');
    });
  });
});
