import { Component, Input } from '@angular/core';
import 'cypress-real-events';
import { curveBasis, schemeTableau10 } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import {
  LinesHoverMoveEmitTooltipData,
  Vic,
  VicChartModule,
  VicHtmlTooltipConfig,
  VicHtmlTooltipModule,
  VicHtmlTooltipOffsetFromOriginPosition,
  VicLinesConfig,
  VicLinesEventOutput,
  VicLinesModule,
  VicPixelDomainPadding,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject } from 'rxjs';
import {
  QdQnCData,
  QdQnCDatum,
  QnQnCData,
  QnQnCDatum,
} from '../testing/data/quant-quant-cat-data';

const margin = { top: 60, right: 20, bottom: 40, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const dateData = QdQnCData;
const numericData = QnQnCData;

// ***********************************************************
// Set up Lines component -- can use with Date or numeric values for x axis
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
          vic-data-marks-lines
          [config]="linesConfig"
          [vicLinesHoverMoveEffects]="hoverEffects"
          (vicLinesHoverMoveOutput)="updateTooltipForNewOutput($event)"
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
        <p>{{ tooltipData.category }}</p>
        <p>{{ tooltipData.x }}</p>
        <p>{{ tooltipData.y }}</p>
      </ng-container>
    </ng-template>
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
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<VicLinesEventOutput<Datum>> =
    new BehaviorSubject<VicLinesEventOutput<Datum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverEffects = [new LinesHoverMoveEmitTooltipData()];

  updateTooltipForNewOutput(data: VicLinesEventOutput<Datum>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: VicLinesEventOutput<Datum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: VicLinesEventOutput<Datum>): void {
    const config = new VicHtmlTooltipConfig();
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 10;
      config.show = true;
    } else {
      config.position.offsetX = null;
      config.position.offsetY = null;
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }
}

const imports = [
  VicChartModule,
  VicLinesModule,
  VicXQuantitativeAxisModule,
  VicYQuantitativeAxisModule,
  VicXyChartModule,
  VicHtmlTooltipModule,
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
  cy.wait(100); // have to wait for axes to render
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
  cy.wait(100); // have to wait for axes to render
}

// ***********************************************************
// Creating the correct marks from the right values
// ***********************************************************
describe('it creates the correct marks - x axis values are Dates', () => {
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
  it('draws line but omits value when a user inputs data with a null value for y axis', () => {
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
  it('draws line but omits value when a user inputs data with y axis value of the wrong type', () => {
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
  it('draws line but omits value when a user inputs data with x axis value of the wrong type', () => {
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
// Tests of domains
// ***********************************************************
describe('if the user specifies a y domain that is smaller than max value', () => {
  it('should draw the lines with the users specified y domain - CORRECT BEHAVIOR CAUSES VISUAL ERROR', () => {
    const linesConfig = Vic.lines<QdQnCDatum>({
      data: dateData,
      x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
        valueAccessor: (d) => d.year,
      }),
      y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
        valueAccessor: (d) => d.population,
        domain: [0, 4900000000],
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
    cy.get('.vic-y')
      .find('.tick text')
      .each(($tick) => {
        const tickValue = parseInt($tick.text());
        expect(tickValue).to.be.gte(0);
        expect(tickValue).to.be.lte(4900000000);
      });
  });
});

describe('if the user specifies an x domain that is smaller than max value', () => {
  it('should draw the lines with the users specified x domain - CORRECT BEHAVIOR CAUSES VISUAL ERROR', () => {
    const linesConfig = Vic.lines<QnQnCDatum>({
      data: numericData,
      x: Vic.dimensionQuantitativeNumeric<QnQnCDatum>({
        valueAccessor: (d) => d.year,
        domain: [2020, 2080],
        includeZeroInDomain: false,
      }),
      y: Vic.dimensionQuantitativeNumeric<QnQnCDatum>({
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
          ...new Set(dateData.map((d) => d.continent)),
        ]);
      });
    cy.get('.vic-x')
      .find('.tick text')
      .each(($tick) => {
        const tickValue = parseInt($tick.text());
        expect(tickValue).to.be.gte(2020);
        expect(tickValue).to.be.lte(2080);
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

  describe('line labels', () => {
    it('draws the correct number of line labels', () => {
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
        labelLines: true,
      });
      mountDateLinesComponent(linesConfig);
      const labels = [];
      cy.get('.vic-line-label')
        .each(($label) => {
          labels.push($label.text());
        })
        .then(() => {
          expect(labels).to.have.members([
            ...new Set(dateData.map((d) => d.continent)),
          ]);
        });
    });
  });
});

// ***********************************************************
// Tests of tooltips
// ***********************************************************
describe('displays tooltips for correct data per hover position', () => {
  beforeEach(() => {
    const linesConfig = Vic.lines<QdQnCDatum>({
      data: dateData,
      x: Vic.dimensionQuantitativeDate<QdQnCDatum>({
        valueAccessor: (d) => d.year,
      }),
      y: Vic.dimensionQuantitativeNumeric<QdQnCDatum>({
        valueAccessor: (d) => d.population,
        domainPadding: new VicPixelDomainPadding({ numPixels: 100 }),
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
  });

  dateData.forEach((_, i) => {
    describe(`Data point at index ${i}`, () => {
      beforeEach(() => {
        cy.get('.vic-lines-datum-marker').eq(i).realHover();
      });

      it('displays a tooltip', () => {
        cy.get('.vic-html-tooltip-overlay').should('be.visible');
      });

      it('tooltip displays correct data', () => {
        cy.get('.vic-html-tooltip-overlay p')
          .eq(0)
          .should('have.text', dateData[i].continent);
        cy.get('.vic-html-tooltip-overlay p')
          .eq(1)
          .then(($el) => {
            expect(new Date($el.text()).getTime()).to.equal(
              dateData[i].year.getTime()
            );
          });
        cy.get('.vic-html-tooltip-overlay p')
          .eq(2)
          .should('have.text', dateData[i].population);
      });

      it('tooltip appears at the correct position', () => {
        cy.get('.vic-html-tooltip-overlay').then(($el) => {
          const tooltipBox = $el[0].getBoundingClientRect();
          cy.get('.vic-lines-datum-marker')
            .eq(i)
            .then(($el) => {
              const markerBox = $el[0].getBoundingClientRect();
              expect((tooltipBox.left + tooltipBox.right) / 2).to.be.closeTo(
                (markerBox.left + markerBox.right) / 2,
                1
              );
              expect(tooltipBox.bottom).to.be.closeTo(markerBox.top, 10);
            });
        });
      });
    });
  });
});
