import { Component, Input } from '@angular/core';
import { schemeTableau10 } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import {
  BarsConfig,
  VicBarsModule,
  VicChartModule,
  VicXQuantitativeAxisBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisBuilder,
  VicYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
import { VicOrdinalAxisConfig } from '../../axes/ordinal/ordinal-axis-config';
import { VicQuantitativeAxisConfig } from '../../axes/quantitative/quantitative-axis-config';
import { VicBarsBuilder } from '../../bars/config/bars-builder';
import { QOCData, QOCDatum } from '../../testing/data/quant-ord-cat-data';

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

// ***********************************************************
// Horizontal bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-horizontal-bar',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
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
          side="top"
        ></svg:g>
        <svg:g
          vic-y-ordinal-axis
          [config]="yOrdinalAxisConfig"
          side="left"
        ></svg:g>
        <svg:g vic-data-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestHorizontalBarsComponent {
  @Input() barsConfig: BarsConfig<QOCDatum, string>;
  @Input() yOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = horizontalMargin;
  dotsPatternMagenta = dotsPatternMagenta;
  dotsPatternTeal = dotsPatternTeal;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
}

const mountHorizontalBarsComponent = (
  barsConfig: BarsConfig<QOCDatum, string>
): void => {
  const xAxisConfig = new VicXQuantitativeAxisBuilder()
    .tickFormat('.0f')
    .build();
  const yAxisConfig = new VicYOrdinalAxisBuilder().build();
  const declarations = [TestHorizontalBarsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicXyChartModule,
  ];

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
  let barsConfig: BarsConfig<QOCDatum, string>;
  beforeEach(() => {
    barsConfig = undefined;
  });
  describe('user does not specify a categorical valueAccessor or a custom scale', () => {
    it('colors every mark by first color in user-provided range if user provides range of length >= 1', () => {
      const color = 'chartreuse';
      barsConfig = new VicBarsBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area)
        )
        .createCategoricalDimension((dimension) =>
          dimension.range([color, 'red', 'yellow'])
        )
        .createLabels((labels) => labels.display(true))
        .build();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar').each(($bar) => {
        expect($bar.attr('fill')).to.equal(color);
      });
    });
    it('colors every mark by first color in the default range if user provides no range and no custom scale', () => {
      const color = schemeTableau10[0];
      barsConfig = new VicBarsBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .build();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar').each(($bar) => {
        expect($bar.attr('fill')).to.equal(color);
      });
    });
  });
  describe('user provides a valueAccessor for the categorical dimension', () => {
    it('colors every mark according to the valueAccessor using default color array', () => {
      const color = schemeTableau10;
      barsConfig = new VicBarsBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createCategoricalDimension((dimension) =>
          dimension.valueAccessor((d) => d.continent)
        )
        .createLabels((labels) => labels.display(true))
        .build();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar').each(($bar, i) => {
        switch (QOCData[i].continent) {
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
      barsConfig = new VicBarsBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createCategoricalDimension((dimension) =>
          dimension
            .valueAccessor((d) => d.continent)
            .scale(customCategoricalScale)
        )
        .createLabels((labels) => labels.display(true))
        .build();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar').each(($bar, i) => {
        switch (QOCData[i].continent) {
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
      barsConfig = new VicBarsBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createCategoricalDimension((dimension) =>
          dimension.scale(customCategoricalScale)
        )
        .createLabels((labels) => labels.display(true))
        .build();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar').each(($bar) => {
        expect($bar.attr('fill')).to.equal('chartreuse');
      });
    });
  });
});

// ***********************************************************
// Marks fill/stroke is correct - testing Fill Pattern
// ***********************************************************
describe('user provides a fill pattern', () => {
  let barsConfig: BarsConfig<QOCDatum, string>;
  beforeEach(() => {
    barsConfig = undefined;
  });
  it('sets bar fill with either the pattern name or the regular fill according to usePattern function', () => {
    barsConfig = new VicBarsBuilder<QOCDatum, string>()
      .orientation('horizontal')
      .data(QOCData)
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.country)
      )
      .createQuantitativeDimension((dimension) =>
        dimension.valueAccessor((d) => d.area).domainPaddingPixels()
      )
      .createCategoricalDimension((dimension) =>
        dimension.fillPatterns([
          {
            name: dotsPatternMagenta,
            usePattern: (d) => d.continent === 'Africa' && d.area > 500000,
          },
        ])
      )
      .createLabels((labels) => labels.display(true))
      .build();
    mountHorizontalBarsComponent(barsConfig);
    cy.get('.vic-bar').each(($bar, i) => {
      if (i === 2) {
        expect($bar.attr('fill')).to.equal(`url(#${dotsPatternMagenta})`);
      } else {
        expect($bar.attr('fill')).to.equal(schemeTableau10[0]);
      }
    });
  });
  it('sets bar fill with either the pattern name or the regular fill according to usePattern function when user provides a scale and valueAccessor', () => {
    barsConfig = new VicBarsBuilder<QOCDatum, string>()
      .orientation('horizontal')
      .data(QOCData)
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.country)
      )
      .createQuantitativeDimension((dimension) =>
        dimension.valueAccessor((d) => d.area).domainPaddingPixels()
      )
      .createCategoricalDimension((dimension) =>
        dimension
          .fillPatterns([
            {
              name: dotsPatternMagenta,
              usePattern: (d) => d.continent === 'Africa' && d.area > 500000,
            },
          ])
          .valueAccessor((d) => d.continent)
          .scale(customCategoricalScale)
      )
      .createLabels((labels) => labels.display(true))
      .build();
    mountHorizontalBarsComponent(barsConfig);
    cy.get('.vic-bar').each(($bar, i) => {
      if (i === 2) {
        expect($bar.attr('fill')).to.equal(`url(#${dotsPatternMagenta})`);
      } else {
        switch (QOCData[i].continent) {
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
  it('sets bar fill with the last matching pattern in fillPatterns array if two patterns match', () => {
    barsConfig = new VicBarsBuilder<QOCDatum, string>()
      .orientation('horizontal')
      .data(QOCData)
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.country)
      )
      .createQuantitativeDimension((dimension) =>
        dimension.valueAccessor((d) => d.area).domainPaddingPixels()
      )
      .createCategoricalDimension((dimension) =>
        dimension
          .fillPatterns([
            {
              name: dotsPatternMagenta,
              usePattern: (d) => d.continent === 'Africa' && d.area > 500000,
            },
            {
              name: dotsPatternTeal,
              usePattern: (d) => d.continent === 'Africa' && d.area > 700000,
            },
          ])
          .range(['lightcoral'])
      )
      .createLabels((labels) => labels.display(true))
      .build();
    mountHorizontalBarsComponent(barsConfig);
    cy.get('.vic-bar').each(($bar, i) => {
      if (i === 2) {
        expect($bar.attr('fill')).to.equal(`url(#${dotsPatternTeal})`);
      } else {
        expect($bar.attr('fill')).to.equal('lightcoral');
      }
    });
  });
});
