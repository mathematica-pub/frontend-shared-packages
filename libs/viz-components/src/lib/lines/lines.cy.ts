import { Component, Input } from '@angular/core';
import 'cypress-real-events';
import { curveBasis, schemeTableau10 } from 'd3';
import {
  LinesHoverMoveDirective,
  LinesHoverMoveEmitTooltipData,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from 'libs/viz-components/src/public-api';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { XQuantitativeAxisConfig } from '../axes/x-quantitative/x-quantitative-axis-config';
import { YQuantitativeAxisConfig } from '../axes/y-quantitative-axis/y-quantitative-axis-config';
import { HoverMoveAction } from '../events/action';
import {
  QdQnCData,
  QdQnCDatum,
  QnQnCData,
  QnQnCDatum,
} from '../testing/data/quant-quant-cat-data';
import { HtmlTooltipConfig } from '../tooltips/html-tooltip/config/html-tooltip-config';
import { LinesConfig } from './config/lines-config';
import { LinesEventOutput } from './events/lines-event-output';

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
          vic-primary-marks-lines
          [config]="linesConfig"
          [vicLinesHoverMoveActions]="hoverActions"
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
  @Input() linesConfig: LinesConfig<Datum>;
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
      .setSize((size) => size.minWidth(340))
      .createOffsetFromOriginPosition((position) =>
        position
          .offsetX(data?.positionX)
          .offsetY(data ? data.positionY - 10 : undefined)
      )
      .show(!!data)
      .getConfig();
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

function mountDateLinesComponent(linesConfig: LinesConfig<QdQnCDatum>): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<Date>()
    .tickFormat('%Y')
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
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
  cy.wait(1000); // have to wait for axes to render
}

function mountNumberLinesComponent(linesConfig: LinesConfig<QnQnCDatum>): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
    .tickFormat('.0f')
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
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
  cy.wait(1000); // have to wait for axes to render
}

// ***********************************************************
// Creating the correct marks from the right values
// ***********************************************************
describe('it creates the correct marks - x axis values are Dates', () => {
  it('should draw the correct number of lines', () => {
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(dateData)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .getConfig();
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
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(testData)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .pointMarkers((markers) => markers.class('test-point-marker'))
      .getConfig();
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
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(testData)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .pointMarkers((markers) => markers.class('test-point-marker'))
      .getConfig();
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
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(testData)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .pointMarkers((markers) => markers.class('test-point-marker'))
      .getConfig();
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
    const linesConfig = new VicLinesConfigBuilder<QnQnCDatum>()
      .data(numericData)
      .xNumber((dimension) =>
        dimension.valueAccessor((d) => d.year).includeZeroInDomain(false)
      )
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .getConfig();
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

  describe('it creates the correct under-line area fills', () => {
    it('should draw the correct number of fills, one for each category', () => {
      const linesConfig = new VicLinesConfigBuilder<QnQnCDatum>()
        .data(numericData)
        .xNumber((dimension) =>
          dimension.valueAccessor((d) => d.year).includeZeroInDomain(false)
        )
        .y((dimension) => dimension.valueAccessor((d) => d.population))
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .areaFills()
        .getConfig();
      mountNumberLinesComponent(linesConfig);
      const categories = [];
      cy.get('.vic-line-area')
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
});

// ***********************************************************
// Tests of domains
// ***********************************************************
describe('if the user specifies a y domain that is smaller than max value', () => {
  it('should draw the lines with the users specified y domain - CORRECT BEHAVIOR CAUSES VISUAL ERROR', () => {
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(dateData)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) =>
        dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
      )
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .getConfig();
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
    const linesConfig = new VicLinesConfigBuilder<QnQnCDatum>()
      .data(numericData)
      .xNumber((dimension) =>
        dimension
          .valueAccessor((d) => d.year)
          .includeZeroInDomain(false)
          .domain([2020, 2080])
      )
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .getConfig();
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
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(dateData)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.get('.vic-line').each(($line, i) => {
      cy.wrap($line).should('have.attr', 'stroke', schemeTableau10[i]);
    });
  });
  it('draws the correct number of lines if a user provides a custom curve function', () => {
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(dateData)
      .curve(curveBasis)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) =>
        dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
      )
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.get('.vic-line').should('have.length', 6);
  });

  describe('pointMarkers', () => {
    const markerClass = 'test-point-marker';
    it('draws the correct number of point markers', () => {
      const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
        .data(dateData)
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .pointMarkers((markers) => markers.class(markerClass))
        .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(`.${markerClass}`).should('have.length', 24);
      cy.get(`.${markerClass}`)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'block'
        )
        .should('have.length', 24);
    });
    it('draws the correct number of point markers with none visible if display is set to false', () => {
      const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
        .data(dateData)
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .pointMarkers((markers) => markers.class(markerClass).display(false))
        .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(`.${markerClass}`).should('have.length', 24);
      cy.get(`.${markerClass}`)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'block'
        )
        .should('have.length', 0);
      cy.get(`.${markerClass}`)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'none'
        )
        .should('have.length', 24);
    });
    it('draws the correct number of point markers with the right number visible if display is set to a function', () => {
      const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
        .data(dateData)
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .pointMarkers((markers) =>
          markers.class(markerClass).display((d) => d.continent === 'Asia')
        )
        .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(`.${markerClass}`).should('have.length', 24);
      cy.get(`.${markerClass}`)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'block'
        )
        .should('have.length', 4);
      cy.get(`.${markerClass}`)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'none'
        )
        .should('have.length', 20);
    });
    it('draws point markers with the correct radius - user provides custom radius', () => {
      const markerClass = 'test-point-marker';
      const radius = 4;
      const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
        .data(dateData)
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .pointMarkers((markers) => markers.class(markerClass).radius(radius))
        .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(`.${markerClass}`).each(($pointMarker) => {
        cy.wrap($pointMarker).should('have.attr', 'r', radius.toString());
      });
    });
  });

  describe('stroke', () => {
    it('draws lines with the correct properties', () => {
      const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
        .data(dateData)
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .pointMarkers()
        .stroke((stroke) =>
          stroke.width(3).opacity(0.5).linecap('square').linejoin('miter')
        )
        .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get('.vic-lines-g').should('have.attr', 'stroke-width', '3');
      cy.get('.vic-lines-g').should('have.attr', 'stroke-opacity', '0.5');
      cy.get('.vic-lines-g').should('have.attr', 'stroke-linecap', 'square');
      cy.get('.vic-lines-g').should('have.attr', 'stroke-linejoin', 'miter');
    });
  });

  describe('line labels', () => {
    it('draws the correct number of line labels', () => {
      const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
        .data(dateData)
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .labelLines(true)
        .getConfig();
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
    const linesConfig = new VicLinesConfigBuilder<QdQnCDatum>()
      .data(dateData)
      .xDate((dimension) =>
        // When running in headless mode, realHover is finicky with point markers that are on the edge of the svg container
        // Padded the x and y domains to avoid this issue
        dimension
          .valueAccessor((d) => d.year)
          .domain([new Date('2020-01-02'), new Date('2104-01-02')])
      )
      .y((dimension) =>
        dimension.valueAccessor((d) => d.population).domainPaddingPixels(100)
      )
      .color((dimension) => dimension.valueAccessor((d) => d.continent))
      .pointMarkers()
      .stroke((stroke) =>
        stroke.width(3).opacity(0.5).linecap('square').linejoin('miter')
      )
      .getConfig();
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
