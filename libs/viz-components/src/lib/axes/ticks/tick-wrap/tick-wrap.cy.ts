// ***********************************************************
// Vertical bars chart component set up

import { Component, Input } from '@angular/core';
import {
  BarsConfig,
  ChartConfig,
  DataValue,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
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
import { beforeEach, cy, describe, expect, it } from 'local-cypress';

type Datum = { state: string; value: number };

const data = [
  { state: 'Alabama but a long label that is wrapped', value: 10 },
  { state: 'Alaska', value: 5 },
  { state: 'Arizona but a long label that is wrapped', value: 8 },
  { state: 'Arkansas', value: 2 },
  { state: 'California but a long label that is wrapped', value: 7 },
  { state: 'Colorado', value: 6 },
];

const oneLineText = ['White/Causasian', 'Black', 'Native American'];
const twoLineText = [
  'Asian-American or Pacific Islander',
  'Non-Hispanic Latino',
];
const fourLineText = ['ThisIs/ALongMadeUp/ValueWithNo/Breaks'];

const dataWithDelimeters = [
  { state: oneLineText[0], value: 10 },
  { state: twoLineText[0], value: 5 },
  { state: oneLineText[1], value: 8 },
  { state: twoLineText[1], value: 2 },
  { state: fourLineText[0], value: 7 },
  { state: oneLineText[2], value: 6 },
];

const elementPositionDelta = 0.5;
const initialRenderWaitTime = 1000;

const assertBeforeAndAfterWindowResize = (assertions: () => void) => {
  assertions();

  // Resize window to check that label positioning is maintained
  cy.viewport(300, 300);
  cy.wait(2000);
  assertions();
};

// ***********************************************************
// Horizontal  bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-horizontal-bars',
  template: `
    <vic-xy-chart [config]="chartConfig">
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
  imports: [VicChartModule, VicBarsModule, VicXyAxisModule],
})
class TestHorizontalBarsComponent {
  @Input() barsConfig: BarsConfig<Datum, string>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  @Input() yOrdinalAxisConfig: VicYOrdinalAxisConfig<string>;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .maxHeight(600)
    .margin({ top: 20, right: 20, bottom: 20, left: 160 })
    .scalingStrategy('responsive-width')
    .getConfig();
}

const mountHorizontalBarsComponent = (
  barsConfig: BarsConfig<Datum, string>,
  yAxisConfig: VicYOrdinalAxisConfig<DataValue>
): void => {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder()
    .ticks((ticks) => ticks.format('.0f'))
    .getConfig();

  cy.mount(TestHorizontalBarsComponent, {
    componentProperties: {
      barsConfig: barsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yOrdinalAxisConfig: yAxisConfig,
    },
  });
};

describe('horizontal bar chart tick labels', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let yAxisConfig: VicYOrdinalAxisConfig<DataValue>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data(data)
      .horizontal((bars) =>
        bars
          .y((dimension) => dimension.valueAccessor((d) => d.state))
          .x((dimension) =>
            dimension.valueAccessor((d) => d.value).domainPaddingPixels(-4)
          )
      )
      .color((dimension) =>
        dimension.valueAccessor(() => '').range(['#000080'])
      )
      .getConfig();
    yAxisConfig = new VicYOrdinalAxisConfigBuilder()
      .ticks((ticks) => ticks.wrap((wrap) => wrap.width(80)))
      .getConfig();
    mountHorizontalBarsComponent(barsConfig, yAxisConfig);
    cy.wait(initialRenderWaitTime); // wait for initial render
  });
  it('renders single-line ticks for short labels', () => {
    assertBeforeAndAfterWindowResize(() =>
      cy.get('.vic-axis-y-ordinal .tick text').then((ticks) => {
        ticks.each((i, $tick) => {
          if (i % 2 === 0) {
            const tspans = $tick.getElementsByTagName('tspan');
            expect(tspans.length).to.equal(1);
          }
        });
      })
    );
  });

  it('correctly wraps and renders multi-line ticks for long labels', () => {
    assertBeforeAndAfterWindowResize(() =>
      cy.get('.vic-axis-y-ordinal .tick text').then((ticks) => {
        ticks.each((i, $tick) => {
          if (i % 2 !== 0) {
            const tspans = $tick.getElementsByTagName('tspan');
            expect(tspans.length).to.equal(3);

            // all dy values are different
            const dyValues = Array.from(tspans).map((span) =>
              span.getAttribute('dy')
            );
            expect(new Set(dyValues).size).to.equal(3);

            // dy values are evenly spaced
            const differences = dyValues.reduce((acc, val, i) => {
              if (i === 0) return acc;
              const diff =
                parseFloat(val || '0') - parseFloat(dyValues[i - 1] || '0');
              const diffRoundedToPointOne = Math.round(diff * 10) / 10;
              acc.push(diffRoundedToPointOne);
              return acc;
            }, []);
            expect(new Set(differences).size).to.equal(1);
          }
        });
      })
    );
  });

  it('correctly centers tick labels on tick marks, vertically', () => {
    assertBeforeAndAfterWindowResize(() =>
      cy.get('.vic-axis-y-ordinal .tick line').then((ticks) => {
        ticks.each((i, $tick) => {
          cy.get('.vic-axis-y-ordinal .tick text')
            .eq(i)
            .then(($label) => {
              const labelRect = $label[0].getBoundingClientRect();
              const tickLineRect = $tick.getBoundingClientRect();
              expect(labelRect.top + labelRect.height / 2).to.be.closeTo(
                tickLineRect.top,
                elementPositionDelta
              );
            });
        });
      })
    );
  });

  it('correctly wraps long ticks with breaking characters', () => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data(dataWithDelimeters)
      .horizontal((bars) =>
        bars
          .y((dimension) => dimension.valueAccessor((d) => d.state))
          .x((dimension) =>
            dimension.valueAccessor((d) => d.value).domainPaddingPixels(-4)
          )
      )
      .color((dimension) =>
        dimension.valueAccessor(() => '').range(['#000080'])
      )
      .getConfig();
    yAxisConfig = new VicYOrdinalAxisConfigBuilder()
      .ticks((ticks) =>
        ticks.wrap((wrap) => wrap.width(80).breakOnChars(['/']))
      )
      .getConfig();
    mountHorizontalBarsComponent(barsConfig, yAxisConfig);
    cy.wait(initialRenderWaitTime); // wait for initial render
    assertBeforeAndAfterWindowResize(() =>
      cy.get('.vic-axis-y-ordinal .tick text').then((ticks) => {
        ticks.each((i, $tick) => {
          const tspans = $tick.getElementsByTagName('tspan');
          const textNoSpaces = $tick.textContent.replace(/\s/g, '');
          // have to compare spaceless because tspan insertion removes spaces
          if (
            oneLineText.map((s) => s.replace(/\s/g, '')).includes(textNoSpaces)
          ) {
            expect(tspans.length).to.equal(1);
          } else if (
            twoLineText.map((s) => s.replace(/\s/g, '')).includes(textNoSpaces)
          ) {
            expect(tspans.length).to.equal(2);
          } else if (
            fourLineText.map((s) => s.replace(/\s/g, '')).includes(textNoSpaces)
          ) {
            expect(tspans.length).to.equal(4);
          }
        });
      })
    );
  });
});

// ***********************************************************
// Vertical bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-vertical-bars',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-x-ordinal-axis [config]="xOrdinalAxisConfig"></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
  imports: [VicChartModule, VicBarsModule, VicXyAxisModule],
})
class TestVerticalBarsComponent {
  @Input() barsConfig: BarsConfig<Datum, string>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xOrdinalAxisConfig: VicXOrdinalAxisConfig<string>;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .maxHeight(600)
    .margin({ top: 20, right: 20, bottom: 10, left: 20 })
    .scalingStrategy('responsive-width')
    .getConfig();
}

const mountVerticalBarsComponent = (
  barsConfig: BarsConfig<Datum, string>,
  xAxisConfig: VicXOrdinalAxisConfig<DataValue>
): void => {
  const yAxisConfig = new VicYQuantitativeAxisConfigBuilder()
    .ticks((ticks) => ticks.format('.0f'))
    .getConfig();

  cy.mount(TestVerticalBarsComponent, {
    componentProperties: {
      barsConfig: barsConfig,
      yQuantitativeAxisConfig: yAxisConfig,
      xOrdinalAxisConfig: xAxisConfig,
    },
  });
};

describe('vertical bar chart tick labels', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let xAxisConfig: VicXOrdinalAxisConfig<DataValue>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data(data)
      .vertical((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.state))
          .y((dimension) =>
            dimension.valueAccessor((d) => d.value).domainPaddingPixels(-4)
          )
      )
      .color((dimension) =>
        dimension.valueAccessor(() => '').range(['#000080'])
      )
      .getConfig();
    xAxisConfig = new VicXOrdinalAxisConfigBuilder()
      .ticks((ticks) => ticks.wrap((wrap) => wrap.width('bandwidth')))
      .getConfig();
    mountVerticalBarsComponent(barsConfig, xAxisConfig);
    cy.wait(initialRenderWaitTime); // wait for initial render
  });
  it('correctly wraps long ticks', () => {
    cy.get('.vic-axis-x-ordinal .tick text').then((ticks) => {
      ticks.each((i, $tick) => {
        const tspans = $tick.getElementsByTagName('tspan');
        // ticks are grabbed left to right, i.e. AL is first tick, CO last tick
        if (i % 2 === 0) {
          expect(tspans.length).to.equal(3);
        } else {
          expect(tspans.length).to.equal(1);
        }
      });
    });
  });

  it('correctly centers tick labels on tick marks, horizontally', () => {
    cy.get('.vic-axis-x-ordinal .tick line').then((ticks) => {
      ticks.each((i, $tick) => {
        cy.get('.vic-axis-x-ordinal .tick text')
          .eq(i)
          .then(($label) => {
            const labelRect = $label[0].getBoundingClientRect();
            const tickLineRect = $tick.getBoundingClientRect();
            expect(labelRect.left + labelRect.width / 2).to.be.closeTo(
              tickLineRect.left,
              elementPositionDelta
            );
          });
      });
    });
  });

  it('wrapped labels are no wider than the width of the bar is wrapped with bandwidth', () => {
    cy.get('.vic-bars-group').then((bars) => {
      bars.each((i, $bar) => {
        cy.get('.vic-axis-x-ordinal .tick text')
          .eq(i)
          .then(($label) => {
            const labelRect = $label[0].getBoundingClientRect();
            const barRect = $bar.getBoundingClientRect();
            expect(labelRect.width).to.be.lessThan(barRect.width + 1);
          });
      });
    });
  });
});
