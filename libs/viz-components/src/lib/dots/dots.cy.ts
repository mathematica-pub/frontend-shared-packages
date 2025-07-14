/* eslint-disable @angular-eslint/prefer-standalone */
// ***********************************************************
// Set up Lines component -- can use with Date or numeric values for x axis

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ChartConfig,
  DotsConfig,
  DotsHost,
  DotsHoverMoveEmitTooltipData,
  DotsInteractionOutput,
  HoverMoveAction,
  HtmlTooltipConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import 'cypress-real-events';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import {
  countryFactsData,
  CountryFactsDatum,
} from '../testing/data/country-area-continent';

// Cypress will get the tick elements before d3 has set the text value of the elements,
// because d3 creates the elements and sets the text value in a transition).
// This wait time is necessary to ensure that the text value of the tick elements has been set by d3.
const axisTickTextWaitTime = 1000;

const margin = { top: 120, right: 80, bottom: 40, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const data = countryFactsData;

const dotGSelector = '.vic-dots-group';
const dotCircleSelector = `.vic-dots-dot`;

// ***********************************************************
// Dots Component with Continuous Quantitative X and Y Axes
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-dots-quant-quant',
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
          vic-primary-marks-dots
          [config]="dotsConfig"
          vicDotsEvents
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
      @if (tooltipData$ | async; as tooltipData) {
        <div
          [style.--color]="tooltipData.color"
          class="dots-example-tooltip-container"
        >
          <p class="tooltip-label country">
            {{ tooltipData.datum.country }}
          </p>
          <p class="tooltip-label fill">
            <span class="value-label">Fill Value</span>
            {{ tooltipData.values.fill }}
          </p>
          <p class="tooltip-label x">
            <span class="value-label">X Value</span>
            {{ tooltipData.values.x }}
          </p>
          <p class="tooltip-label y">
            <span class="value-label">Y Value</span>
            {{ tooltipData.values.y }}
          </p>
          <p class="tooltip-label radius">
            <span class="value-label">Radius Value</span>
            {{ tooltipData.values.radius }}
          </p>
        </div>
      }
    </ng-template>
  `,
  styles: ['.tooltip-label { font-size: 12px; }'],
  imports: [
    VicChartModule,
    VicDotsModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
    CommonModule,
  ],
})
class TestDotsQuantQuantComponent<Datum> {
  @Input() dotsConfig: DotsConfig<Datum>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<DotsInteractionOutput<Datum>> =
    new BehaviorSubject<DotsInteractionOutput<Datum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverMoveActions: HoverMoveAction<DotsHost<Datum>>[] = [
    new DotsHoverMoveEmitTooltipData(),
  ];
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .maxHeight(chartHeight)
    .maxWidth(chartWidth)
    .margin(margin)
    .scalingStrategy('responsive-width')
    .getConfig();

  updateTooltipForNewOutput(data: DotsInteractionOutput<Datum>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: DotsInteractionOutput<Datum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: DotsInteractionOutput<Datum>): void {
    console.log('updateTooltipConfig', data);
    const config = new VicHtmlTooltipConfigBuilder()
      .positionFromOutput(data)
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}

function mountDotsXQuantYQuantComponent(
  dotsConfig: DotsConfig<CountryFactsDatum>
): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
    .ticks((ticks) => ticks.format('.0f').count(5))
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
  cy.mount(TestDotsQuantQuantComponent<CountryFactsDatum>, {
    componentProperties: {
      dotsConfig: dotsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

// ***********************************************************
// Dots Component with Ordinal Y and Continuous X Axes
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-dots-ordinal-quant',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-y-ordinal-axis [config]="yOrdinalAxisConfig"></svg:g>
        <svg:g vic-primary-marks-dots [config]="dotsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: ['.tooltip-label { font-size: 12px; }'],
  imports: [
    VicChartModule,
    VicDotsModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
  ],
})
class TestDotsXQuantYOrdinalComponent<Datum> {
  @Input() dotsConfig: DotsConfig<Datum>;
  @Input() yOrdinalAxisConfig: VicYOrdinalAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .maxHeight(chartHeight)
    .maxWidth(chartWidth)
    .margin(margin)
    .scalingStrategy('responsive-width')
    .getConfig();
}

function mountDotsXQuantYOrdinalComponent(
  dotsConfig: DotsConfig<CountryFactsDatum>
): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
    .ticks((ticks) => ticks.format('.0f').count(5))
    .getConfig();
  const yAxisConfig = new VicYOrdinalAxisConfigBuilder<string>().getConfig();
  cy.mount(TestDotsXQuantYOrdinalComponent<CountryFactsDatum>, {
    componentProperties: {
      dotsConfig: dotsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yOrdinalAxisConfig: yAxisConfig,
    },
  });
}

// ***********************************************************
// Dots Component with Ordinal X and Continuous Y Axes
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-lines',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-x-ordinal-axis [config]="xOrdinalAxisConfig"></svg:g>
        <svg:g vic-primary-marks-dots [config]="dotsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: ['.tooltip-label { font-size: 12px; }'],
  imports: [
    VicChartModule,
    VicDotsModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
  ],
})
class TestDotsXOrdinalYQuantComponent<Datum> {
  @Input() dotsConfig: DotsConfig<Datum>;
  @Input() xOrdinalAxisConfig: VicXOrdinalAxisConfig<string>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .maxHeight(chartHeight)
    .maxWidth(chartWidth)
    .margin(margin)
    .scalingStrategy('responsive-width')
    .getConfig();
}

function mountDotsXOrdinalYQuantComponent(
  dotsConfig: DotsConfig<CountryFactsDatum>
): void {
  const yAxisConfig = new VicYQuantitativeAxisConfigBuilder<number>()
    .ticks((ticks) => ticks.format('.0f').count(5))
    .getConfig();
  const xAxisConfig = new VicXOrdinalAxisConfigBuilder<string>().getConfig();
  cy.mount(TestDotsXOrdinalYQuantComponent<CountryFactsDatum>, {
    componentProperties: {
      dotsConfig: dotsConfig,
      yQuantitativeAxisConfig: yAxisConfig,
      xOrdinalAxisConfig: xAxisConfig,
    },
  });
}

// ***********************************************************
// Creating the dots - Quantitative - Quantitative Chart Axes
// ***********************************************************
describe('it creates one dot for each valid value in the data with the expected color and radius', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(data)
      .class((d) => d.country)
      .xNumeric((x) => x.valueAccessor((d) => d.population))
      .yNumeric((y) => y.valueAccessor((d) => d.gdpPerCapita))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .getConfig();
    mountDotsXQuantYQuantComponent(dotsConfig);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get(dotGSelector)
      .each((dotG) => {
        const country = dotG.attr('class').split(' ');
        country.shift();
        dotKeys.push(country.join(' ').trim());
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
  it('should draw dots with the expected color', () => {
    const continents = [...new Set(data.map((d) => d.continent))];
    cy.get(dotGSelector).each((dotG) => {
      const classes = dotG.attr('class').split(' ');
      classes.shift();
      const country = classes.join(' ').trim();
      const continent = data.find((d) => d.country === country).continent;
      const expectedFill = colors[continents.indexOf(continent)];
      expect(dotG.children().first().attr('fill')).to.equal(expectedFill);
    });
  });
  it('should draw dots with the expected radius', () => {
    const dotRadii = [];
    cy.get(dotGSelector)
      .each((dotG) => {
        const classes = dotG.attr('class').split(' ');
        classes.shift();
        const country = classes.join(' ');
        dotRadii.push({ country, r: dotG.children().first().attr('r') });
      })
      .then(() => {
        const countriesByRadius = dotRadii
          .slice()
          .sort((a, b) => a.r - b.r)
          .map((d) => d.country);
        const countriesByPopGrowth = data
          .slice()
          .sort((a, b) => a.popGrowth - b.popGrowth)
          .map((d) => d.country);
        expect(countriesByRadius).to.deep.equal(countriesByPopGrowth);
      });
  });
});

// ***********************************************************
// Positional data with negative values
// ***********************************************************
describe('it handles negative y-dimension values', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dataWithNegatives = cloneDeep(data);
    dataWithNegatives[0].gdpPerCapita = -10000;
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(dataWithNegatives)
      .class((d) => d.country)
      .xNumeric((x) => x.valueAccessor((d) => d.population))
      .yNumeric((y) => y.valueAccessor((d) => d.gdpPerCapita))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .getConfig();
    mountDotsXQuantYQuantComponent(dotsConfig);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get(dotGSelector)
      .each((dotG) => {
        const country = dotG.attr('class').split(' ');
        country.shift();
        dotKeys.push(country.join(' ').trim());
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
});

describe('it handles negative x-dimension values', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dataWithNegatives = cloneDeep(data);
    dataWithNegatives[0].gdpPerCapita = -10000;
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(dataWithNegatives)
      .class((d) => d.country)
      .xNumeric((x) => x.valueAccessor((d) => d.gdpPerCapita))
      .yNumeric((y) => y.valueAccessor((d) => d.population))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .getConfig();
    mountDotsXQuantYQuantComponent(dotsConfig);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get(dotGSelector)
      .each((dotG) => {
        const country = dotG.attr('class').split(' ');
        country.shift();
        dotKeys.push(country.join(' ').trim());
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
});

// ***********************************************************
// Tooltips
// ***********************************************************
describe('displays a tooltips with correct data on each dot', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(data)
      .class((d) => d.country)
      .xNumeric((x) => x.valueAccessor((d) => d.population))
      .yNumeric((y) => y.valueAccessor((d) => d.gdpPerCapita))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([4, 16])
      )
      .getConfig();
    mountDotsXQuantYQuantComponent(dotsConfig);
    cy.wait(1000);
  });
  data.forEach((datum) => {
    describe(`when hovering over the dot for ${datum.country}`, () => {
      beforeEach(() => {
        cy.get(
          `${dotGSelector}.${datum.country.split(' ')[0]} ${dotCircleSelector}`
        ).realHover();
      });
      it('should display a tooltip with the correct data', () => {
        cy.get('.vic-html-tooltip-overlay').should('exist');
        cy.get('.tooltip-label.country').should('contain', datum.country);
        cy.get('.tooltip-label.fill').should('contain', datum.continent);
        cy.get('.tooltip-label.x').should('contain', datum.population);
        cy.get('.tooltip-label.y').should('contain', datum.gdpPerCapita);
        cy.get('.tooltip-label.radius').should('contain', datum.popGrowth);
      });
    });
  });
});

// ***********************************************************
// Creating the dots - Quantitative - Ordinal Chart Axes
// ***********************************************************
describe('it creates one dot for each valid value in the data with the expected color and radius', () => {
  beforeEach(() => {
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(data)
      .class((d) => d.country)
      .xNumeric((x) => x.valueAccessor((d) => d.population))
      .yOrdinal((y) => y.valueAccessor((d) => d.continent))
      .fillNumeric((fill) =>
        fill.valueAccessor((d) => d.gdpPerCapita).range(['white', 'dodgerblue'])
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .stroke((stroke) => stroke.color('black').width(1))
      .class((d) => d.country)
      .getConfig();
    mountDotsXQuantYOrdinalComponent(dotsConfig);
    cy.wait(axisTickTextWaitTime);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get(dotGSelector)
      .each((dotG) => {
        const country = dotG.attr('class').split(' ');
        country.shift();
        dotKeys.push(country.join(' ').trim());
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
  it('should draw dots with the expected cy value based on y value', () => {
    cy.get('.vic-dots-group').each((dotG) => {
      const country = dotG.attr('class').split(' ');
      country.shift();
      const continent = data.find(
        (d) => d.country === country.join(' ')
      ).continent;
      cy.get('.vic-axis-y-ordinal .tick').each((tick) => {
        cy.wrap(tick)
          .find('text')
          .then((text) => {
            if (text.text() === continent) {
              const y = +tick.attr('transform').split(',')[1].split(')')[0];
              const expectedCy = +dotG
                .attr('transform')
                .split(',')[1]
                .split(')')[0];
              expect(expectedCy).to.be.closeTo(y, 1);
            }
          });
      });
    });
  });
});

// ***********************************************************
// Creating the dots - Ordinal - Quantitative Chart Axes
// ***********************************************************
describe('it creates one dot for each valid value in the data with the expected color and radius', () => {
  beforeEach(() => {
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(data)
      .class((d) => d.country)
      .yNumeric((x) => x.valueAccessor((d) => d.population))
      .xOrdinal((y) => y.valueAccessor((d) => d.continent))
      .fillNumeric((fill) =>
        fill.valueAccessor((d) => d.gdpPerCapita).range(['white', 'dodgerblue'])
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .stroke((stroke) => stroke.color('black').width(1))
      .class((d) => d.country)
      .getConfig();
    mountDotsXOrdinalYQuantComponent(dotsConfig);
    cy.wait(axisTickTextWaitTime);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get(dotGSelector)
      .each((dotG) => {
        const country = dotG.attr('class').split(' ');
        country.shift();
        dotKeys.push(country.join(' ').trim());
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
  it('should draw dots with the expected cx value based on x value', () => {
    cy.get('.vic-dots-group').each((dotG) => {
      const country = dotG.attr('class').split(' ');
      country.shift();
      const continent = data.find(
        (d) => d.country === country.join(' ')
      ).continent;
      cy.get('.vic-axis-x-ordinal .tick').each((tick) => {
        cy.wrap(tick)
          .find('text')
          .then((text) => {
            if (text.text() === continent) {
              const x = +tick.attr('transform').split(',')[0].split('(')[1];
              const expectedCx = +dotG
                .attr('transform')
                .split(',')[0]
                .split('(')[1];
              expect(expectedCx).to.be.closeTo(x, 1);
            }
          });
      });
    });
  });
});
