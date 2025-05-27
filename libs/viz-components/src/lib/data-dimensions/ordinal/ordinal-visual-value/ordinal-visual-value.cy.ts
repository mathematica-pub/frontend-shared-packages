/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import {
  BarsConfig,
  ChartConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { schemeTableau10 } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import {
  countryFactsData,
  CountryFactsDatum,
} from '../../../testing/data/country-area-continent';

const dotsPatternMagenta = 'dotsMagenta';
const dotsPatternTeal = 'dotsTeal';
const horizontalMargin = { top: 36, right: 20, bottom: 4, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const customCategoricalScale = (d: string) => {
  switch (d) {
    case 'Asia':
      return 'red';
    case 'Europe':
      return 'blue';
    case 'Africa':
      return 'green';
    case 'North America':
      return 'yellow';
    case 'South America':
      return 'purple';
    default:
      return 'chartreuse';
  }
};

const barSelector = '.vic-bars-bar';

// ***********************************************************
// Horizontal bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-horizontal-bar',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-defs>
        <svg:pattern
          [id]="dotsPatternMagenta"
          x="2"
          y="2"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect x="3" y="3" width="2" height="2" fill="magenta" />
        </svg:pattern>
        <svg:pattern
          [id]="dotsPatternTeal"
          x="2"
          y="2"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect x="3" y="3" width="2" height="2" fill="teal" />
        </svg:pattern>
      </ng-container>
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-y-ordinal-axis [config]="yOrdinalAxisConfig"></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
  standalone: false,
})
class TestHorizontalBarsComponent {
  @Input() barsConfig: BarsConfig<CountryFactsDatum, string>;
  @Input() yOrdinalAxisConfig: VicYOrdinalAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  dotsPatternMagenta = dotsPatternMagenta;
  dotsPatternTeal = dotsPatternTeal;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .height(chartHeight)
    .width(chartWidth)
    .margin(horizontalMargin)
    .resize({ height: false, useViewbox: false })
    .getConfig();
}

const mountHorizontalBarsComponent = (
  barsConfig: BarsConfig<CountryFactsDatum, string>
): void => {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder()
    .ticks((ticks) => ticks.format('.0f'))
    .getConfig();
  const yAxisConfig = new VicYOrdinalAxisConfigBuilder().getConfig();
  const declarations = [TestHorizontalBarsComponent];
  const imports = [VicChartModule, VicBarsModule, VicXyAxisModule];

  cy.mount(TestHorizontalBarsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yOrdinalAxisConfig: yAxisConfig,
    },
  });
};

// ***********************************************************
// Marks fill/stroke is correct
// ***********************************************************
describe('marks have expected fill', () => {
  let barsConfig: BarsConfig<CountryFactsDatum, string>;
  beforeEach(() => {
    barsConfig = undefined;
  });
  describe('user does not specify a categorical valueAccessor or a custom scale', () => {
    it('colors every mark by first color in user-provided range if user provides range of length >= 1', () => {
      const color = 'chartreuse';
      barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
        .data(countryFactsData)
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.area))
            .y((dimension) => dimension.valueAccessor((d) => d.country))
        )
        .color((dimension) => dimension.range([color, 'red', 'yellow']))
        .labels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get(barSelector).each(($bar) => {
        expect($bar.attr('fill')).to.equal(color);
      });
    });
    it('colors every mark by first color in the default range if user provides no range and no custom scale', () => {
      const color = schemeTableau10[0];
      barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
        .data(countryFactsData)
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.area).domainPaddingPixels()
            )
            .y((dimension) => dimension.valueAccessor((d) => d.country))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get(barSelector).each(($bar) => {
        expect($bar.attr('fill')).to.equal(color);
      });
    });
  });
  describe('user provides a valueAccessor for the categorical dimension', () => {
    it('colors every mark according to the valueAccessor using default color array', () => {
      const color = schemeTableau10;
      barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
        .data(countryFactsData)
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.area).domainPaddingPixels()
            )
            .y((dimension) => dimension.valueAccessor((d) => d.country))
        )
        .color((dimension) => dimension.valueAccessor((d) => d.continent))
        .labels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get(barSelector).each(($bar, i) => {
        switch (countryFactsData[i].continent) {
          case 'Asia':
            expect($bar.attr('fill')).to.equal(color[0]);
            break;
          case 'Europe':
            expect($bar.attr('fill')).to.equal(color[1]);
            break;
          case 'Africa':
            expect($bar.attr('fill')).to.equal(color[2]);
            break;
          case 'North America':
            expect($bar.attr('fill')).to.equal(color[3]);
            break;
          case 'South America':
            expect($bar.attr('fill')).to.equal(color[4]);
            break;
          default:
            expect($bar.attr('fill')).to.equal(color[5]);
        }
      });
    });
  });
  describe('user provides a custom scale for the categorical dimension', () => {
    it('colors every mark according to the custom scale when user also provides a value accessor', () => {
      barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
        .data(countryFactsData)
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.area).domainPaddingPixels()
            )
            .y((dimension) => dimension.valueAccessor((d) => d.country))
        )
        .color((dimension) =>
          dimension
            .valueAccessor((d) => d.continent)
            .scale(customCategoricalScale)
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get(barSelector).each(($bar, i) => {
        switch (countryFactsData[i].continent) {
          case 'Asia':
            expect($bar.attr('fill')).to.equal('red');
            break;
          case 'Europe':
            expect($bar.attr('fill')).to.equal('blue');
            break;
          case 'Africa':
            expect($bar.attr('fill')).to.equal('green');
            break;
          case 'North America':
            expect($bar.attr('fill')).to.equal('yellow');
            break;
          case 'South America':
            expect($bar.attr('fill')).to.equal('purple');
            break;
          default:
            expect($bar.attr('fill')).to.equal('chartreuse');
        }
      });
    });
    it('colors every mark according to the custom scales behavior with empty string arg when user does not provide a value accessor', () => {
      barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
        .data(countryFactsData)
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.area).domainPaddingPixels()
            )
            .y((dimension) => dimension.valueAccessor((d) => d.country))
        )
        .color((dimension) => dimension.scale(customCategoricalScale))
        .labels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get(barSelector).each(($bar) => {
        expect($bar.attr('fill')).to.equal('chartreuse');
      });
    });
  });
});

// ***********************************************************
// Marks fill/stroke is correct - testing Fill Pattern
// ***********************************************************
describe('user provides a fill pattern', () => {
  let barsConfig: BarsConfig<CountryFactsDatum, string>;
  beforeEach(() => {
    barsConfig = undefined;
  });
  it('sets bar fill with either the pattern name or the regular fill according to shouldApply function', () => {
    barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
      .data(countryFactsData)
      .horizontal((bars) =>
        bars
          .x((dimension) =>
            dimension.valueAccessor((d) => d.area).domainPaddingPixels()
          )
          .y((dimension) => dimension.valueAccessor((d) => d.country))
      )
      .customFills([
        {
          defId: dotsPatternMagenta,
          shouldApply: (d) => d.continent === 'Africa' && d.area > 500000,
        },
      ])
      .labels((labels) => labels.display(true))
      .getConfig();
    mountHorizontalBarsComponent(barsConfig);
    cy.get(barSelector).each(($bar, i) => {
      if (i === 2) {
        expect($bar.attr('fill')).to.equal(`url(#${dotsPatternMagenta})`);
      } else {
        expect($bar.attr('fill')).to.equal(schemeTableau10[0]);
      }
    });
  });
  it('sets bar fill with either the pattern name or the regular fill according to shouldApply function when user provides a scale and valueAccessor', () => {
    barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
      .data(countryFactsData)
      .horizontal((bars) =>
        bars
          .x((dimension) =>
            dimension.valueAccessor((d) => d.area).domainPaddingPixels()
          )
          .y((dimension) => dimension.valueAccessor((d) => d.country))
      )
      .color((dimension) =>
        dimension
          .valueAccessor((d) => d.continent)
          .scale(customCategoricalScale)
      )
      .customFills([
        {
          defId: dotsPatternMagenta,
          shouldApply: (d) => d.continent === 'Africa' && d.area > 500000,
        },
      ])
      .labels((labels) => labels.display(true))
      .getConfig();
    mountHorizontalBarsComponent(barsConfig);
    cy.get(barSelector).each(($bar, i) => {
      if (i === 2) {
        expect($bar.attr('fill')).to.equal(`url(#${dotsPatternMagenta})`);
      } else {
        switch (countryFactsData[i].continent) {
          case 'Asia':
            expect($bar.attr('fill')).to.equal('red');
            break;
          case 'Europe':
            expect($bar.attr('fill')).to.equal('blue');
            break;
          case 'Africa':
            expect($bar.attr('fill')).to.equal('green');
            break;
          case 'North America':
            expect($bar.attr('fill')).to.equal('yellow');
            break;
          case 'South America':
            expect($bar.attr('fill')).to.equal('purple');
            break;
          default:
            expect($bar.attr('fill')).to.equal('chartreuse');
        }
      }
    });
  });
  it('sets bar fill with the last matching pattern in customFills array if two patterns match', () => {
    barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
      .data(countryFactsData)
      .horizontal((bars) =>
        bars
          .x((dimension) =>
            dimension.valueAccessor((d) => d.area).domainPaddingPixels()
          )
          .y((dimension) => dimension.valueAccessor((d) => d.country))
      )
      .color((dimension) => dimension.range(['lightcoral']))
      .customFills([
        {
          defId: dotsPatternMagenta,
          shouldApply: (d) => d.continent === 'Africa' && d.area > 500000,
        },
        {
          defId: dotsPatternTeal,
          shouldApply: (d) => d.continent === 'Africa' && d.area > 700000,
        },
      ])
      .labels((labels) => labels.display(true))
      .getConfig();
    mountHorizontalBarsComponent(barsConfig);
    cy.get(barSelector).each(($bar, i) => {
      if (i === 2) {
        expect($bar.attr('fill')).to.equal(`url(#${dotsPatternTeal})`);
      } else {
        expect($bar.attr('fill')).to.equal('lightcoral');
      }
    });
  });
});
