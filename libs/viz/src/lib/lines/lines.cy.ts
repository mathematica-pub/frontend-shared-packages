/* eslint-disable @angular-eslint/prefer-standalone */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ChartConfig,
  HoverMoveAction,
  HtmlTooltipConfig,
  LinesConfig,
  LinesHost,
  LinesHoverMoveEmitTooltipData,
  LinesInteractionOutput,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@mathstack/viz';
import 'cypress-real-events';
import { curveBasis, schemeTableau10 } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import {
  continentPopulationDateYearData,
  ContinentPopulationDateYearDatum,
  ContinentPopulationNumYearData,
  ContinentPopulationNumYearDatum,
} from '../testing/data/continent-population-year-data';

// Cypress will get the tick elements before d3 has set the text value of the elements,
// because d3 creates the elements and sets the text value in a transition).
// This wait time is necessary to ensure that the text value of the tick elements has been set by d3.
const axisTickTextWaitTime = 1000;

const margin = { top: 60, right: 20, bottom: 40, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const dateData = continentPopulationDateYearData;
const numericData = ContinentPopulationNumYearData;

const lineSelector = '.vic-lines-line';
const markerSelector = '.vic-lines-marker';

// ***********************************************************
// Set up Lines component -- can use with Date or numeric values for x axis
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-lines',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g
          vic-primary-marks-lines
          [config]="linesConfig"
          vicLinesEvents
          [hoverMoveActions]="hoverMoveActions"
          (interactionOutput)="updateTooltipForNewOutput($event)"
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
        <p class="tooltip-text">{{ tooltipData.values.strokeColor }}</p>
        <p class="tooltip-text">{{
          getYearFromStringDate(tooltipData.values.x)
        }}</p>
        <p class="tooltip-text">{{ tooltipData.values.y }}</p>
      </ng-container>
    </ng-template>
  `,
  styles: [
    '.tooltip-text { font-size: 12px; }  .events-disabled { pointer-events: none; }',
  ],
  imports: [
    VicChartModule,
    VicLinesModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
    CommonModule,
  ],
})
class TestLinesComponent<Datum, QuantAxisType extends number | Date> {
  @Input() linesConfig: LinesConfig<Datum>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<QuantAxisType>;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesInteractionOutput<Datum>> =
    new BehaviorSubject<LinesInteractionOutput<Datum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverMoveActions: HoverMoveAction<LinesHost<Datum>>[] = [
    new LinesHoverMoveEmitTooltipData(),
  ];
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .maxHeight(chartHeight)
    .maxWidth(chartWidth)
    .margin(margin)
    .scalingStrategy('responsive-width')
    .getConfig();

  updateTooltipForNewOutput(data: LinesInteractionOutput<Datum>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: LinesInteractionOutput<Datum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: LinesInteractionOutput<Datum>): void {
    const config = new VicHtmlTooltipConfigBuilder()
      .size((size) => size.minWidth(100))
      .positionFromOutput(data)
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }

  getYearFromStringDate(dateString: string): number {
    return new Date(dateString).getFullYear();
  }
}

function mountDateLinesComponent(
  linesConfig: LinesConfig<ContinentPopulationDateYearDatum>
): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<Date>()
    .ticks((ticks) => ticks.format('%Y'))
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
  cy.mount(TestLinesComponent<ContinentPopulationDateYearDatum, Date>, {
    componentProperties: {
      linesConfig: linesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

function mountNumberLinesComponent(
  linesConfig: LinesConfig<ContinentPopulationNumYearDatum>
): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
    .ticks((ticks) => ticks.format('.0f'))
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
  cy.mount(TestLinesComponent<ContinentPopulationNumYearDatum, number>, {
    componentProperties: {
      linesConfig: linesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

// ***********************************************************
// Creating the correct marks from the right values
// ***********************************************************
describe('it creates the correct marks - x axis values are Dates', () => {
  it('should draw the correct number of lines', () => {
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(dateData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xDate((xDate) => xDate.valueAccessor((d) => d.year))
        .y((y) => y.valueAccessor((d) => d.population))
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .getConfig();
    mountDateLinesComponent(linesConfig);
    const categories = [];
    cy.get(lineSelector)
      .each((line) => {
        categories.push(line.attr('class').split(' ')[1].split('-').join(' '));
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
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(testData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xDate((xDate) => xDate.valueAccessor((d) => d.year))
        .y((y) => y.valueAccessor((d) => d.population))
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .pointMarkers((markers) =>
          markers.class((d) => d.continent.split(' ').join('-'))
        )
        .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.get('.vic-lines-marker')
      .each((marker) => {
        const category = marker
          .attr('class')
          .split(' ')[1]
          .split('-')
          .join(' ');
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
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(testData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) => dimension.valueAccessor((d) => d.population))
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .pointMarkers((markers) =>
          markers.class((d) => d.continent.split(' ').join('-'))
        )
        .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.get('.vic-lines-marker')
      .each((marker) => {
        const category = marker
          .attr('class')
          .split(' ')[1]
          .split('-')
          .join(' ');
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
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(testData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) => dimension.valueAccessor((d) => d.population))
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .pointMarkers((markers) =>
          markers.class((d) => d.continent.split(' ').join('-'))
        )
        .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.get('.vic-lines-marker')
      .each((marker) => {
        const category = marker
          .attr('class')
          .split(' ')[1]
          .split('-')
          .join(' ');
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
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationNumYearDatum>()
        .data(numericData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xNumeric((dimension) =>
          dimension.valueAccessor((d) => d.year).includeZeroInDomain(false)
        )
        .y((dimension) => dimension.valueAccessor((d) => d.population))
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .getConfig();
    mountNumberLinesComponent(linesConfig);
    const categories = [];
    cy.get(lineSelector)
      .each((line) => {
        categories.push(line.attr('class').split(' ')[1].split('-').join(' '));
      })
      .then(() => {
        expect(categories).to.have.members([
          ...new Set(numericData.map((d) => d.continent)),
        ]);
      });
  });

  describe('it creates the correct under-line area fills', () => {
    it('should draw the correct number of fills, one for each category', () => {
      const linesConfig =
        new VicLinesConfigBuilder<ContinentPopulationNumYearDatum>()
          .data(numericData)
          .datumClass((d) => d.continent.split(' ').join('-'))
          .xNumeric((dimension) =>
            dimension.valueAccessor((d) => d.year).includeZeroInDomain(false)
          )
          .y((dimension) => dimension.valueAccessor((d) => d.population))
          .stroke((stroke) =>
            stroke.color((color) => color.valueAccessor((d) => d.continent))
          )
          .areaFills()
          .getConfig();
      mountNumberLinesComponent(linesConfig);
      cy.get('.vic-lines-area').should(
        'have.length',
        [...new Set(numericData.map((x) => x.continent))].length
      );
    });
  });
});

// ***********************************************************
// Tests of domains
// ***********************************************************
describe('if the user specifies a y domain that is smaller than max value', () => {
  it('should draw the lines with the users specified y domain - CORRECT BEHAVIOR CAUSES VISUAL ERROR', () => {
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(dateData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.wait(axisTickTextWaitTime);
    const categories = [];
    cy.get(lineSelector)
      .each(($lines) => {
        categories.push(
          $lines.attr('class').split(' ')[1].split('-').join(' ')
        );
      })
      .then(() => {
        expect(categories).to.have.members([
          ...new Set(dateData.map((d) => d.continent)),
        ]);
      });
    cy.get('.vic-axis-y-quantitative .tick text').each(($tick) => {
      const tickValue = parseInt($tick.text());
      expect(tickValue).to.be.gte(0);
      expect(tickValue).to.be.lte(4900000000);
    });
  });
});

describe('if the user specifies an x domain that is smaller than max value', () => {
  it('should draw the lines with the users specified x domain - CORRECT BEHAVIOR CAUSES VISUAL ERROR', () => {
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationNumYearDatum>()
        .data(numericData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xNumeric((dimension) =>
          dimension
            .valueAccessor((d) => d.year)
            .includeZeroInDomain(false)
            .domain([2020, 2080])
        )
        .y((dimension) => dimension.valueAccessor((d) => d.population))
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .getConfig();
    mountNumberLinesComponent(linesConfig);
    cy.wait(axisTickTextWaitTime);
    const categories = [];
    cy.get(lineSelector)
      .each((line) => {
        categories.push(line.attr('class').split(' ')[1].split('-').join(' '));
      })
      .then(() => {
        expect(categories).to.have.members([
          ...new Set(dateData.map((d) => d.continent)),
        ]);
      });
    cy.get('.vic-axis-x-quantitative .tick text').each(($tick) => {
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
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(dateData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) => dimension.valueAccessor((d) => d.population))
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.get(lineSelector).each(($line, i) => {
      cy.wrap($line).should('have.attr', 'stroke', schemeTableau10[i]);
    });
  });
  it('draws the correct number of lines if a user provides a custom curve function', () => {
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(dateData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .curve(curveBasis)
        .xDate((dimension) => dimension.valueAccessor((d) => d.year))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
        )
        .stroke((stroke) =>
          stroke.color((color) => color.valueAccessor((d) => d.continent))
        )
        .getConfig();
    mountDateLinesComponent(linesConfig);
    cy.get(lineSelector).should('have.length', 6);
  });

  describe('pointMarkers', () => {
    it('draws the correct number of point markers', () => {
      const linesConfig =
        new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
          .data(dateData)
          .datumClass((d) => d.continent.split(' ').join('-'))
          .xDate((dimension) => dimension.valueAccessor((d) => d.year))
          .y((dimension) =>
            dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
          )
          .stroke((stroke) =>
            stroke.color((color) => color.valueAccessor((d) => d.continent))
          )
          .pointMarkers()
          .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(markerSelector).should('have.length', 24);
      cy.get(markerSelector)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'block'
        )
        .should('have.length', 24);
    });
    it('draws the correct number of point markers with none visible if display is set to false', () => {
      const linesConfig =
        new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
          .data(dateData)
          .datumClass((d) => d.continent.split(' ').join('-'))
          .xDate((dimension) => dimension.valueAccessor((d) => d.year))
          .y((dimension) =>
            dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
          )
          .stroke((stroke) =>
            stroke.color((color) => color.valueAccessor((d) => d.continent))
          )
          .pointMarkers((markers) => markers.display(false))
          .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(markerSelector).should('have.length', 24);
      cy.get(markerSelector)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'block'
        )
        .should('have.length', 0);
      cy.get(markerSelector)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'none'
        )
        .should('have.length', 24);
    });
    it('draws the correct number of point markers with the right number visible if display is set to a function', () => {
      const linesConfig =
        new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
          .data(dateData)
          .datumClass((d) => d.continent.split(' ').join('-'))
          .xDate((dimension) => dimension.valueAccessor((d) => d.year))
          .y((dimension) =>
            dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
          )
          .stroke((stroke) =>
            stroke.color((color) => color.valueAccessor((d) => d.continent))
          )
          .pointMarkers((markers) =>
            markers.display((d) => d.continent === 'Asia')
          )
          .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(markerSelector).should('have.length', 24);
      cy.get(markerSelector)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'block'
        )
        .should('have.length', 4);
      cy.get(markerSelector)
        .filter(
          (index, element) =>
            window.getComputedStyle(element).display === 'none'
        )
        .should('have.length', 20);
    });
    it('draws point markers with the correct radius - user provides custom radius', () => {
      const radius = 4;
      const linesConfig =
        new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
          .data(dateData)
          .datumClass((d) => d.continent.split(' ').join('-'))
          .xDate((dimension) => dimension.valueAccessor((d) => d.year))
          .y((dimension) =>
            dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
          )
          .stroke((stroke) =>
            stroke.color((color) => color.valueAccessor((d) => d.continent))
          )
          .pointMarkers((markers) => markers.radius(radius))
          .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get(markerSelector).each(($pointMarker) => {
        cy.wrap($pointMarker).should('have.attr', 'r', radius.toString());
      });
    });
  });

  describe('stroke', () => {
    it('draws lines with the correct properties', () => {
      const linesConfig =
        new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
          .data(dateData)
          .datumClass((d) => d.continent.split(' ').join('-'))
          .xDate((dimension) => dimension.valueAccessor((d) => d.year))
          .y((dimension) =>
            dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
          )
          .stroke((stroke) =>
            stroke.color((color) => color.valueAccessor((d) => d.continent))
          )
          .pointMarkers()
          .stroke((stroke) =>
            stroke.width(3).opacity(0.5).linecap('square').linejoin('miter')
          )
          .getConfig();
      mountDateLinesComponent(linesConfig);
      cy.get('.vic-lines').should('have.attr', 'stroke-width', '3');
      cy.get('.vic-lines').should('have.attr', 'stroke-opacity', '0.5');
      cy.get('.vic-lines').should('have.attr', 'stroke-linecap', 'square');
      cy.get('.vic-lines').should('have.attr', 'stroke-linejoin', 'miter');
    });
  });

  describe('line labels', () => {
    it('draws the correct number of line labels', () => {
      const linesConfig =
        new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
          .data(dateData)
          .datumClass((d) => d.continent.split(' ').join('-'))
          .xDate((dimension) => dimension.valueAccessor((d) => d.year))
          .y((dimension) =>
            dimension.valueAccessor((d) => d.population).domain([0, 4900000000])
          )
          .stroke((stroke) =>
            stroke.color((color) => color.valueAccessor((d) => d.continent))
          )
          .labelLines(true)
          .getConfig();
      mountDateLinesComponent(linesConfig);
      const labels = [];
      cy.get('.vic-lines-label')
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
    cy.viewport(800, 600); // ensure that tts don't get repositioned at the edges of the chart
    const linesConfig =
      new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
        .data(dateData)
        .datumClass((d) => d.continent.split(' ').join('-'))
        .xDate((xDate) =>
          // When running in headless mode, realHover is finicky with point markers that are on the edge of the svg container
          // Padded the x and y domains to avoid this issue
          xDate
            .valueAccessor((d) => d.year)
            .domain([new Date('2020-01-02'), new Date('2104-01-02')])
        )
        .y((y) => y.valueAccessor((d) => d.population).domainPaddingPixels(100))
        .stroke((stroke) =>
          stroke
            .color((color) => color.valueAccessor((d) => d.continent))
            .width(3)
            .opacity(0.5)
            .linecap('square')
            .linejoin('miter')
        )
        .pointMarkers()
        .getConfig();
    mountDateLinesComponent(linesConfig);
  });

  dateData.forEach((_, i) => {
    describe(`Data point at index ${i}`, () => {
      beforeEach(() => {
        cy.get('.vic-lines-marker').eq(i).realHover();
      });

      it('displays a tooltip', () => {
        cy.get('.vic-html-tooltip-overlay').should('exist');
      });

      it('hides the tooltip on Esc button press', () => {
        cy.get('body').focus().type('{esc}');
        cy.get('.vic-html-tooltip-overlay').should('not.exist');
      });

      it('tooltip displays correct data', () => {
        cy.get('.vic-html-tooltip-overlay p')
          .eq(0)
          .should('have.text', dateData[i].continent);
        cy.get('.vic-html-tooltip-overlay p')
          .eq(1)
          .then(($el) => {
            expect(+$el.text()).to.equal(dateData[i].year.getFullYear());
          });
        cy.get('.vic-html-tooltip-overlay p')
          .eq(2)
          .should('have.text', dateData[i].population);
      });

      it('tooltip appears at the correct position', () => {
        cy.get('.vic-html-tooltip-overlay').then(($el) => {
          const tooltipBox = $el[0].getBoundingClientRect();
          cy.get('.vic-lines-marker')
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
