/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import 'cypress/support/component';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';

import {
  VicBarsModule,
  VicChartModule,
  VicPixelDomainPaddingConfig,
  VicXOrdinalAxisModule,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { VicAxisConfig } from '../../axes/axis.config';
import {
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicHorizontalBarsDimensionsConfig,
  VicVerticalBarsDimensionsConfig,
} from '../../bars/bars.config';

const dataWithAllValueTypes = [
  { state: 'Alabama', value: -10 },
  { state: 'Alaska', value: -8 },
  { state: 'Arizona', value: 10 },
  { state: 'Arkansas', value: 8 },
  { state: 'California', value: null },
];
const dataWithNegativeAndOmittedValues = [
  { state: 'Alabama', value: -10 },
  { state: 'Alaska', value: -8 },
  { state: 'California', value: null },
];
const dataWithPositiveAndOmittedValues = [
  { state: 'Alabama', value: 10 },
  { state: 'Alaska', value: 8 },
  { state: 'California', value: null },
];
const dataWithOmittedValues = [
  { state: 'Alabama', value: null },
  { state: 'Alaska', value: null },
  { state: 'California', value: null },
];
const dataWithOmittedAndZeroValues = [
  { state: 'Alabama', value: null },
  { state: 'Alaska', value: 0 },
  { state: 'California', value: null },
];
const dataWithZeroValues = [
  { state: 'Alabama', value: null },
  { state: 'Alaska', value: 0 },
  { state: 'California', value: null },
];
const labelOffset = 6;

const assertPositionOfBarAndDataLabel = (
  index: number,
  assertions: (barPosition: DOMRect, labelPosition: DOMRect) => void
): void => {
  cy.get('.vic-bar')
    .eq(index)
    .then(($bar) => {
      cy.get('.vic-bar-label')
        .eq(index)
        .then(($label) => {
          const barPosition = $bar[0].getBoundingClientRect();
          const labelPosition = $label[0].getBoundingClientRect();
          assertions(barPosition, labelPosition);
        });
    });
};

const assertPositionOfZeroAxisAndDataLabel = (
  axis: 'x' | 'y',
  assertions: (tickPosition: DOMRect, labelPosition: DOMRect) => void,
  index?: number
): void => {
  cy.get(`.vic-${axis}.vic-axis-g .tick text`)
    .contains(/^0$/)
    .siblings()
    .then(($tick) => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (index === undefined || index === i) {
          const tickPosition = $tick[0].getBoundingClientRect();
          const labelPosition = $label[0].getBoundingClientRect();
          assertions(tickPosition, labelPosition);
        }
      });
    });
};

// ***********************************************************
// Vertical bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-vertical-bar-with-labels',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="400"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-ordinal-axis
          [config]="xOrdinalAxisConfig"
          side="bottom"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
          side="left"
        ></svg:g>
        <svg:g vic-data-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestVerticalBarWithLabelsComponent {
  @Input() barsConfig: VicBarsConfig<any>;
  @Input() xOrdinalAxisConfig: VicAxisConfig;
  @Input() yQuantitativeAxisConfig: VicAxisConfig;
  margin = { top: 20, right: 20, bottom: 0, left: 40 };
}

const mountVerticalBarComponent = (barsConfig: VicBarsConfig<any>): void => {
  const xAxisConfig = new VicAxisConfig();
  const yAxisConfig = new VicAxisConfig();
  yAxisConfig.tickFormat = '.0f';

  const declarations = [TestVerticalBarWithLabelsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    VicXyChartModule,
  ];

  cy.mount(TestVerticalBarWithLabelsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      xOrdinalAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
  cy.wait(100);
};

describe('it correctly positions the vertical bar chart data labels', () => {
  let barsConfig: VicBarsConfig<any>;
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.dimensions = new VicVerticalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.category.colors = ['#000080'];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    barsConfig.labels.offset = labelOffset;
    barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig();
    barsConfig.quantitative.domainPadding.numPixels = 4;
  });
  describe('for bar data that has positive, negative, and omitted values', () => {
    beforeEach(() => {
      barsConfig.data = dataWithAllValueTypes;
      mountVerticalBarComponent(barsConfig);
    });
    it('centers all data labels with respect to their x-axis tick', () => {
      cy.get('.vic-x.vic-axis-g .tick line').then((ticks) => {
        ticks.each((i, $tick) => {
          cy.get('.vic-bar-label')
            .eq(i)
            .then(($label) => {
              const labelPosition = $label[0].getBoundingClientRect();
              const tickPosition = $tick.getBoundingClientRect();
              expect(
                Math.round(labelPosition.width / 2 + labelPosition.left)
              ).to.equal(Math.round(tickPosition.x));
            });
        });
      });
    });
    describe('when there is not enough vertical space between the bar and chart edge', () => {
      it('places data label for negative value completely inside the bar at the bottom', () => {
        assertPositionOfBarAndDataLabel(
          0,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(barPosition.top);
            expect(labelPosition.bottom).to.be.lessThan(barPosition.bottom);
            expect(
              Math.round(barPosition.bottom - labelPosition.bottom)
            ).to.equal(labelOffset);
          }
        );
      });
      it('places data label for positive value completely inside the bar at the top', () => {
        assertPositionOfBarAndDataLabel(
          2,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(barPosition.top);
            expect(labelPosition.bottom).to.be.lessThan(barPosition.bottom);
            expect(Math.round(labelPosition.top - barPosition.top)).to.equal(
              labelOffset
            );
          }
        );
      });
      it('uses the lighter default text color (white) for the data labels color', () => {
        cy.get('.vic-bar-label').each(($label, i) => {
          if (i === 0 || i === 2) {
            cy.wrap($label)
              .should('have.attr', 'style')
              .and('include', 'fill: rgb(255, 255, 255)');
          }
        });
      });
    });

    describe('when there is ample vertical space between the bar and the chart edge', () => {
      it('places data label for negative value below the bar and above the chart edge', () => {
        assertPositionOfBarAndDataLabel(
          1,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(barPosition.bottom);
            cy.get('.vic-y.vic-axis-g').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.bottom).to.be.lessThan(axisPosition.bottom);
            });
            expect(Math.round(labelPosition.top - barPosition.bottom)).to.equal(
              labelOffset
            );
          }
        );
      });
      it('places data label for positive value above the bar and below the chart edge', () => {
        assertPositionOfBarAndDataLabel(
          3,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.bottom).to.be.lessThan(barPosition.top);
            cy.get('.vic-y.vic-axis-g').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.top).to.be.greaterThan(axisPosition.top);
            });
            expect(Math.round(barPosition.top - labelPosition.bottom)).to.equal(
              labelOffset
            );
          }
        );
      });
      it('uses the darker default text color (black) for the data labels color', () => {
        cy.get('.vic-bar-label').each(($label, i) => {
          if (i === 1 || i === 3) {
            cy.wrap($label)
              .should('have.attr', 'style')
              .and('includes', 'fill: rgb(0, 0, 0)');
          }
        });
      });
    });

    describe('when the data label is for an omitted value', () => {
      it('offsets data label above scales.y(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'y',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.bottom).to.be.lessThan(tickPosition.y);
            expect(Math.round(tickPosition.y - labelPosition.bottom)).to.equal(
              labelOffset
            );
          },
          4
        );
      });
      it('uses the darker default text color for the data labels color', () => {
        cy.get('.vic-bar-label').each(($label, i) => {
          if (i === 4) {
            cy.wrap($label)
              .should('have.attr', 'style')
              .and('includes', 'fill: rgb(0, 0, 0)');
          }
        });
      });
    });
  });

  describe('for bar data that has negative and omitted values', () => {
    beforeEach(() => {
      barsConfig.data = dataWithNegativeAndOmittedValues;
      barsConfig.quantitative.domain = [-10, 10];
      mountVerticalBarComponent(barsConfig);
    });
    describe('when the data label is for an omitted value', () => {
      it('offsets data label below scales.y(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'y',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(tickPosition.y);
            expect(Math.round(labelPosition.top - tickPosition.y)).to.equal(
              labelOffset
            );
          },
          2
        );
      });
    });
  });

  describe('for bar data that has positive and omitted values', () => {
    beforeEach(() => {
      barsConfig.data = dataWithPositiveAndOmittedValues;
      mountVerticalBarComponent(barsConfig);
    });
    describe('when the data label is for an omitted value', () => {
      it('offsets data label above scales.y(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'y',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.bottom).to.be.lessThan(tickPosition.y);
            expect(Math.round(tickPosition.y - labelPosition.bottom)).to.equal(
              labelOffset
            );
          },
          2
        );
      });
    });
  });

  [
    { data: dataWithOmittedValues, valueType: 'omitted' },
    { data: dataWithZeroValues, valueType: 'zero' },
    { data: dataWithOmittedAndZeroValues, valueType: 'omitted and zero' },
  ].forEach((item) => {
    describe(`for bar data that only has ${item.valueType} values`, () => {
      beforeEach(() => {
        barsConfig.data = item.data;
      });
      describe('when the domain is undefined in the bars config', () => {
        beforeEach(() => {
          mountVerticalBarComponent(barsConfig);
        });
        it('offsets data label above scales.y(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'y',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              expect(labelPosition.bottom).to.be.lessThan(tickPosition.y);
              expect(
                Math.round(tickPosition.y - labelPosition.bottom)
              ).to.equal(labelOffset);
            }
          );
        });
      });
      describe('when the domain is set in the bars config and the minimum value is negative', () => {
        beforeEach(() => {
          barsConfig.quantitative.domain = [-10, 0];
          mountVerticalBarComponent(barsConfig);
        });
        it('offsets data label below scales.y(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'y',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              expect(labelPosition.top).to.be.greaterThan(tickPosition.y);
              expect(Math.round(labelPosition.top - tickPosition.y)).to.equal(
                labelOffset
              );
            }
          );
        });
      });
    });
  });
});

// ***********************************************************
// Horizontal  bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-horizontal-bar-with-labels',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="200"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
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
class TestHorizontalBarWithLabelsComponent {
  @Input() barsConfig: VicBarsConfig<any>;
  @Input() xQuantitativeAxisConfig: VicAxisConfig;
  @Input() yOrdinalAxisConfig: VicAxisConfig;
  margin = { top: 20, right: 20, bottom: 20, left: 60 };
}

const mountHorizontalBarComponent = (barsConfig: VicBarsConfig<any>): void => {
  const xAxisConfig = new VicAxisConfig();
  xAxisConfig.tickFormat = '.0f';
  const yAxisConfig = new VicAxisConfig();

  const declarations = [TestHorizontalBarWithLabelsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicXyChartModule,
  ];

  cy.mount(TestHorizontalBarWithLabelsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yOrdinalAxisConfig: yAxisConfig,
    },
  });
  cy.wait(100);
};

describe('it correctly positions the horizontal bar chart data labels', () => {
  let barsConfig: VicBarsConfig<any>;
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.category.colors = ['#000080'];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    barsConfig.labels.offset = labelOffset;
    barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig();
    barsConfig.quantitative.domainPadding.numPixels = 4;
  });
  describe('for bar data that has positive, negative, and omitted values', () => {
    beforeEach(() => {
      barsConfig.data = dataWithAllValueTypes;
      mountHorizontalBarComponent(barsConfig);
    });
    it('centers all data labels with respect to their y-axis tick', () => {
      cy.get('.vic-y.vic-axis-g .tick line').then((ticks) => {
        const reversedTicks = Array.from(ticks).reverse();
        reversedTicks.forEach((tick, i) => {
          cy.get('.vic-bar-label')
            .eq(i)
            .then(($label) => {
              const labelPosition = $label[0].getBoundingClientRect();
              const tickPosition = tick.getBoundingClientRect();
              expect(
                Math.round(labelPosition.height / 2 + labelPosition.top)
              ).to.equal(Math.round(tickPosition.y));
            });
        });
      });
    });

    describe('when there is not enough horizontal space between the bar and chart edge', () => {
      it('places data label for negative value completely inside the bar to the left', () => {
        assertPositionOfBarAndDataLabel(
          0,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.left).to.be.greaterThan(barPosition.left);
            expect(labelPosition.right).to.be.lessThan(barPosition.right);
            expect(Math.round(labelPosition.left - barPosition.left)).to.equal(
              labelOffset
            );
          }
        );
      });
      it('places data label for positive value completely inside the bar to the right', () => {
        assertPositionOfBarAndDataLabel(
          2,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.left).to.be.greaterThan(barPosition.left);
            expect(labelPosition.right).to.be.lessThan(barPosition.right);
            expect(
              Math.round(barPosition.right - labelPosition.right)
            ).to.equal(labelOffset);
          }
        );
      });
      it('uses the lighter default text color (white) for the data labels color', () => {
        cy.get('.vic-bar-label').each(($label, i) => {
          if (i === 0 || i === 2) {
            cy.wrap($label)
              .should('have.attr', 'style')
              .and('include', 'fill: rgb(255, 255, 255)');
          }
        });
      });
    });

    describe('when there is ample vertical space between the bar and the chart edge', () => {
      it('places data label for negative value in between bar and the left chart edge', () => {
        assertPositionOfBarAndDataLabel(
          1,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.right).to.be.lessThan(barPosition.left);
            cy.get('.vic-x.vic-axis-g').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.left).to.be.greaterThan(axisPosition.left);
            });
            expect(Math.round(barPosition.left - labelPosition.right)).to.equal(
              labelOffset
            );
          }
        );
      });
      it('places data label for positive value in between bar and the right chart edge', () => {
        assertPositionOfBarAndDataLabel(
          3,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.left).to.be.greaterThan(barPosition.right);
            cy.get('.vic-x.vic-axis-g').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.right).to.be.lessThan(axisPosition.right);
            });
            expect(Math.round(labelPosition.left - barPosition.right)).to.equal(
              labelOffset
            );
          }
        );
      });
      it('uses the darker default text color (black) for the data labels color', () => {
        cy.get('.vic-bar-label').each(($label, i) => {
          if (i === 1 || i === 3) {
            cy.wrap($label)
              .should('have.attr', 'style')
              .and('includes', 'fill: rgb(0, 0, 0)');
          }
        });
      });
    });

    describe('when the data label is for an omitted value', () => {
      it('offsets data label to the left of scales.x(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'x',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.left).to.be.greaterThan(tickPosition.x);
            expect(Math.round(labelPosition.left - tickPosition.x)).to.equal(
              labelOffset
            );
          },
          4
        );
      });
      it('uses the darker default text color for the data labels color', () => {
        cy.get('.vic-bar-label').each(($label, i) => {
          if (i === 4) {
            cy.wrap($label)
              .should('have.attr', 'style')
              .and('includes', 'fill: rgb(0, 0, 0)');
          }
        });
      });
    });
  });

  describe('for bar data that has negative and omitted values', () => {
    beforeEach(() => {
      barsConfig.data = dataWithNegativeAndOmittedValues;
      barsConfig.quantitative.domain = [-10, 10];
      mountHorizontalBarComponent(barsConfig);
    });
    describe('when the data label is for an omitted value', () => {
      it('offsets data label to the right of scales.x(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'x',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.right).to.be.lessThan(tickPosition.x);
            expect(Math.round(labelPosition.top - tickPosition.y)).to.equal(
              labelOffset
            );
          },
          2
        );
      });
    });
  });

  describe('for bar data that has positive and omitted values', () => {
    beforeEach(() => {
      barsConfig.data = dataWithPositiveAndOmittedValues;
      mountHorizontalBarComponent(barsConfig);
    });
    describe('when the data label is for an omitted value', () => {
      it('offsets data label above scales.x(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'x',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.left).to.be.greaterThan(tickPosition.x);
            expect(Math.round(labelPosition.left - tickPosition.x)).to.equal(
              labelOffset
            );
          },
          2
        );
      });
    });
  });

  [
    { data: dataWithOmittedValues, valueType: 'omitted' },
    { data: dataWithZeroValues, valueType: 'zero' },
    { data: dataWithOmittedAndZeroValues, valueType: 'omitted and zero' },
  ].forEach((item) => {
    describe(`for bar data that only has ${item.valueType} values`, () => {
      beforeEach(() => {
        barsConfig.data = item.data;
      });
      describe('when the domain is undefined in the bars config', () => {
        beforeEach(() => {
          mountHorizontalBarComponent(barsConfig);
        });
        it('offsets data label above scales.x(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'x',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              expect(labelPosition.left).to.be.greaterThan(tickPosition.x);
              expect(Math.round(labelPosition.left - tickPosition.x)).to.equal(
                labelOffset
              );
            }
          );
        });
      });
      describe('when the domain is set in the bars config and the minimum value is negative', () => {
        beforeEach(() => {
          barsConfig.quantitative.domain = [-10, 0];
          mountHorizontalBarComponent(barsConfig);
        });
        it('offsets data label below scales.x(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'x',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              expect(labelPosition.right).to.be.lessThan(tickPosition.x);
              expect(Math.round(tickPosition.x - labelPosition.right)).to.equal(
                labelOffset
              );
            }
          );
        });
      });
    });
  });
});
