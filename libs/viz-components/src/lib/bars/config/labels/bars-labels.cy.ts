/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import {
  ChartConfig,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicXOrdinalAxisConfig,
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisConfig,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from 'libs/viz-components/src/public-api';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { VicBarsConfigBuilder } from '../bars-builder';
import { BarsConfig } from '../bars-config';

type Datum = { state: string; value: number };

const dataWithAllValueTypes = [
  { state: 'Alabama', value: -10 },
  { state: 'Alaska', value: -5 },
  { state: 'Arizona', value: 10 },
  { state: 'Arkansas', value: 5 },
  { state: 'California', value: null },
  { state: 'Colorado', value: 0 },
];
const dataWithNegativeZeroAndNonnumericValues = [
  { state: 'Alabama', value: -10 },
  { state: 'Alaska', value: -5 },
  { state: 'Arizona', value: null },
  { state: 'Arkansas', value: 0 },
];
const dataWithPositiveZeroAndNonnumericValues = [
  { state: 'Alabama', value: 10 },
  { state: 'Alaska', value: 5 },
  { state: 'Arizona', value: null },
  { state: 'Arkansas', value: 0 },
];
const dataWithNonnumericValues = [
  { state: 'Alabama', value: null },
  { state: 'Alaska', value: null },
  { state: 'California', value: null },
];
const dataWithZeroAndNonnumericValues = [
  { state: 'Alabama', value: null },
  { state: 'Alaska', value: 0 },
  { state: 'California', value: null },
];
const dataWithZeroValues = [
  { state: 'Alabama', value: 0 },
  { state: 'Alaska', value: 0 },
  { state: 'California', value: 0 },
];
const labelOffset = 4;
const elementPositionDelta = 0.5;
const defaultTextColorRgb = 'rgb(0, 0, 0)';
const alternativeTextColorRgb = 'rgb(255, 255, 255)';

const barSelector = '.vic-bars-bar';
const labelSelector = '.vic-bars-label';

const assertPositionOfBarAndDataLabel = (
  index: number,
  assertions: (barPosition: DOMRect, labelPosition: DOMRect) => void
): void => {
  const assertionFn = () => {
    cy.get(barSelector)
      .eq(index)
      .then(($bar) => {
        cy.get(labelSelector)
          .eq(index)
          .then(($label) => {
            const barPosition = $bar[0].getBoundingClientRect();
            const labelPosition = $label[0].getBoundingClientRect();
            assertions(barPosition, labelPosition);
          });
      });
  };
  checkPositionBeforeAndAfterWindowResize(assertionFn);
};

const assertPositionOfTickForZeroAndDataLabel = (
  axis: 'x' | 'y',
  assertions: (tickPosition: DOMRect, labelPosition: DOMRect) => void,
  indices?: number[]
): void => {
  const assertionFn = () => {
    cy.get(`.vic-axis-${axis}-quantitative .tick text`)
      .contains(/^0$/)
      .siblings()
      .then(($tick) => {
        cy.get(labelSelector).each(($label, i) => {
          if (indices === undefined || indices.includes(i)) {
            const tickPosition = $tick[0].getBoundingClientRect();
            const labelPosition = $label[0].getBoundingClientRect();
            assertions(tickPosition, labelPosition);
          }
        });
      });
  };
  checkPositionBeforeAndAfterWindowResize(assertionFn);
};

const checkPositionBeforeAndAfterWindowResize = (assertions: () => void) => {
  assertions();

  // Resize window to check that label positioning is maintained
  cy.viewport(300, 300);
  cy.wait(2000);
  assertions();
};

const distanceBetweenElementAndDataLabelIsOffset = (distance: number) => {
  expect(distance).to.be.closeTo(labelOffset, elementPositionDelta);
};

const barLabelColorMatchesExpectedRgb = (
  rgb: string,
  indices?: number[]
): void => {
  cy.get(labelSelector).each(($label, i) => {
    if (indices === undefined || indices.includes(i)) {
      cy.wrap($label)
        .should('have.attr', 'style')
        .and('includes', `fill: ${rgb}`);
    }
  });
};

// ***********************************************************
// Vertical bars chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-vertical-bar-with-labels',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g vic-x-ordinal-axis [config]="xOrdinalAxisConfig"></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestVerticalBarsWithLabelsComponent {
  @Input() barsConfig: BarsConfig<Datum, string>;
  @Input() xOrdinalAxisConfig: VicXOrdinalAxisConfig<string>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .height(400)
    .margin({ top: 20, right: 20, bottom: 0, left: 40 })
    .resize({ useViewbox: false })
    .getConfig();
}

const mountVerticalBarsComponent = (
  barsConfig: BarsConfig<Datum, string>
): void => {
  const xAxisConfig = new VicXOrdinalAxisConfigBuilder().getConfig();
  const yAxisConfig = new VicYQuantitativeAxisConfigBuilder()
    .ticks((ticks) => ticks.format('.0f'))
    .getConfig();

  const declarations = [TestVerticalBarsWithLabelsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    VicXyChartModule,
  ];

  cy.mount(TestVerticalBarsWithLabelsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      xOrdinalAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
};

describe('it correctly positions the vertical bar chart data labels', () => {
  let barsConfig: BarsConfig<Datum, string>;
  describe('for bar data that has positive, negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<Datum, string>()
        .data(dataWithAllValueTypes)
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
        .labels((labels) => labels.display(true).offset(labelOffset))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
    });
    it('centers all data labels with respect to their x-axis tick', () => {
      checkPositionBeforeAndAfterWindowResize(() =>
        cy.get('.vic-axis-x-ordinal .tick line').then((ticks) => {
          ticks.each((i, $tick) => {
            cy.get(labelSelector)
              .eq(i)
              .then(($label) => {
                const labelPosition = $label[0].getBoundingClientRect();
                const tickPosition = $tick.getBoundingClientRect();
                expect(
                  labelPosition.width / 2 + labelPosition.left
                ).to.be.closeTo(
                  tickPosition.width / 2 + tickPosition.left,
                  elementPositionDelta
                );
              });
          });
        })
      );
    });
    describe('when there is not enough vertical space between the bar and chart edge', () => {
      it('places data label for negative value completely inside the bar at the bottom', () => {
        assertPositionOfBarAndDataLabel(
          0,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(barPosition.top);
            expect(labelPosition.bottom).to.be.lessThan(barPosition.bottom);
            distanceBetweenElementAndDataLabelIsOffset(
              barPosition.bottom - labelPosition.bottom
            );
          }
        );
      });
      it('places data label for positive value completely inside the bar at the top', () => {
        assertPositionOfBarAndDataLabel(
          2,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(barPosition.top);
            expect(labelPosition.bottom).to.be.lessThan(barPosition.bottom);
            distanceBetweenElementAndDataLabelIsOffset(
              labelPosition.top - barPosition.top
            );
          }
        );
      });
      it('uses the alternative text color (white) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(alternativeTextColorRgb, [0, 2]);
      });
    });

    describe('when there is ample vertical space between the bar and the chart edge', () => {
      it('places data label for negative value in between bar and the bottom chart edge', () => {
        assertPositionOfBarAndDataLabel(
          1,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(barPosition.bottom);
            cy.get('.vic-axis-y-quantitative').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.bottom).to.be.lessThan(axisPosition.bottom);
            });
            distanceBetweenElementAndDataLabelIsOffset(
              labelPosition.top - barPosition.bottom
            );
          }
        );
      });
      it('places data label for positive value in between bar and the upper chart edge', () => {
        assertPositionOfBarAndDataLabel(
          3,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.bottom).to.be.lessThan(barPosition.top);
            cy.get('.vic-axis-y-quantitative').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.top).to.be.greaterThan(axisPosition.top);
            });
            distanceBetweenElementAndDataLabelIsOffset(
              barPosition.top - labelPosition.bottom
            );
          }
        );
      });
      it('uses the default text color (black) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [1, 3]);
      });
    });

    describe('when the data label is for a zero or non-numeric value', () => {
      it('offsets data label above scales.y(0)', () => {
        assertPositionOfTickForZeroAndDataLabel(
          'y',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            distanceBetweenElementAndDataLabelIsOffset(
              tickPosition.top - labelPosition.bottom
            );
          },
          [4, 5]
        );
      });
      it('uses the default text color (black) for the data label color', () => {
        barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [4, 5]);
      });
    });
  });

  describe('for bar data that has negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<Datum, string>()
        .data(dataWithNegativeZeroAndNonnumericValues)
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
        .labels((labels) => labels.display(true).offset(labelOffset))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
    });
    it('offsets data label for zero and non-numerics value below scales.y(0)', () => {
      assertPositionOfTickForZeroAndDataLabel(
        'y',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            labelPosition.top - tickPosition.bottom
          );
        },
        [2, 3]
      );
    });
    it('uses the default text color (black) for the zero and non-numeric label color', () => {
      barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [2, 3]);
    });
  });

  describe('for bar data that has positive, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<Datum, string>()
        .data(dataWithPositiveZeroAndNonnumericValues)
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
        .labels((labels) => labels.display(true).offset(labelOffset))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
    });
    it('offsets data label for zero and non-numeric values above scales.y(0)', () => {
      assertPositionOfTickForZeroAndDataLabel(
        'y',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            tickPosition.top - labelPosition.bottom
          );
        },
        [2, 3]
      );
    });
    it('uses the default text color (black) for the zero and non-numeric label color', () => {
      barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [2, 3]);
    });
  });

  [
    { data: dataWithNonnumericValues, valueType: 'non-numeric' },
    { data: dataWithZeroValues, valueType: 'zero' },
    {
      data: dataWithZeroAndNonnumericValues,
      valueType: 'non-numeric and zero',
    },
  ].forEach((item) => {
    describe(`for bar data that only has ${item.valueType} values`, () => {
      describe('when the domain maximum is greater than 0', () => {
        beforeEach(() => {
          barsConfig = new VicBarsConfigBuilder<Datum, string>()
            .data(item.data)
            .vertical((bars) =>
              bars
                .x((dimension) => dimension.valueAccessor((d) => d.state))
                .y((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .domain([0, 10])
                    .domainPaddingPixels(-4)
                )
            )
            .color((dimension) =>
              dimension.valueAccessor(() => '').range(['#000080'])
            )
            .labels((labels) => labels.display(true).offset(labelOffset))
            .getConfig();
          mountVerticalBarsComponent(barsConfig);
        });
        it('offsets data label above scales.y(0)', () => {
          assertPositionOfTickForZeroAndDataLabel(
            'y',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                tickPosition.top - labelPosition.bottom
              );
            }
          );
        });
        it('uses the default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(defaultTextColorRgb);
        });
      });
      describe('when the domain maximum is not greater than 0', () => {
        beforeEach(() => {
          barsConfig = new VicBarsConfigBuilder<Datum, string>()
            .data(item.data)
            .vertical((bars) =>
              bars
                .x((dimension) => dimension.valueAccessor((d) => d.state))
                .y((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .domain([-10, 0])
                    .domainPaddingPixels(-4)
                )
            )
            .color((dimension) =>
              dimension.valueAccessor(() => '').range(['#000080'])
            )
            .labels((labels) => labels.display(true).offset(labelOffset))
            .getConfig();
          mountVerticalBarsComponent(barsConfig);
        });
        it('offsets data label below scales.y(0)', () => {
          assertPositionOfTickForZeroAndDataLabel(
            'y',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                labelPosition.top - tickPosition.bottom
              );
            }
          );
        });
        it('uses the default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(defaultTextColorRgb);
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
  selector: 'app-test-horizontal-bars-with-labels',
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
})
class TestHorizontalBarsWithLabelsComponent {
  @Input() barsConfig: BarsConfig<Datum, string>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  @Input() yOrdinalAxisConfig: VicYOrdinalAxisConfig<string>;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .height(200)
    .margin({ top: 20, right: 20, bottom: 20, left: 60 })
    .resize({ height: false, useViewbox: false })
    .getConfig();
}

const mountHorizontalBarsComponent = (
  barsConfig: BarsConfig<Datum, string>
): void => {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder()
    .ticks((ticks) => ticks.format('.0f'))
    .getConfig();
  const yAxisConfig = new VicYOrdinalAxisConfigBuilder().getConfig();

  const declarations = [TestHorizontalBarsWithLabelsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicXyChartModule,
  ];

  cy.mount(TestHorizontalBarsWithLabelsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yOrdinalAxisConfig: yAxisConfig,
    },
  });
};

describe('it correctly positions the horizontal bar chart data labels', () => {
  let barsConfig: BarsConfig<Datum, string>;
  describe('for bar data that has positive, negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<Datum, string>()
        .data(dataWithAllValueTypes)
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .color((dimension) =>
          dimension.valueAccessor(() => '').range(['#000080'])
        )
        .labels((labels) => labels.display(true).offset(labelOffset))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
    });
    it('centers all data labels with respect to their y-axis tick', () => {
      checkPositionBeforeAndAfterWindowResize(() =>
        cy.get('.vic-axis-y-ordinal .tick line').then((ticks) => {
          const reversedTicks = Array.from(ticks).reverse();
          reversedTicks.forEach((tick, i) => {
            cy.get(labelSelector)
              .eq(i)
              .then(($label) => {
                const labelPosition = $label[0].getBoundingClientRect();
                const tickPosition = tick.getBoundingClientRect();
                expect(
                  labelPosition.height / 2 + labelPosition.top
                ).to.be.closeTo(
                  tickPosition.height / 2 + tickPosition.top,
                  elementPositionDelta
                );
              });
          });
        })
      );
    });
    describe('for values that result in insufficient space for the label between bar end and chart edge', () => {
      it('places data label for negative value completely inside the bar to the left', () => {
        assertPositionOfBarAndDataLabel(
          0,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.left).to.be.greaterThan(barPosition.left);
            expect(labelPosition.right).to.be.lessThan(barPosition.right);
            distanceBetweenElementAndDataLabelIsOffset(
              labelPosition.left - barPosition.left
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
            distanceBetweenElementAndDataLabelIsOffset(
              barPosition.right - labelPosition.right
            );
          }
        );
      });
      it('uses the alternative text color (white) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(alternativeTextColorRgb, [0, 2]);
      });
    });

    describe('for values that result in sufficient space for the label between bar end and chart edge', () => {
      it('places data label for negative value in between bar and the left chart edge', () => {
        assertPositionOfBarAndDataLabel(
          1,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.right).to.be.lessThan(barPosition.left);
            cy.get('.vic-axis-x-quantitative').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.left).to.be.greaterThan(axisPosition.left);
            });
            distanceBetweenElementAndDataLabelIsOffset(
              barPosition.left - labelPosition.right
            );
          }
        );
      });
      it('places data label for positive value in between bar and the right chart edge', () => {
        assertPositionOfBarAndDataLabel(
          3,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.left).to.be.greaterThan(barPosition.right);
            cy.get('.vic-axis-x-quantitative').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.right).to.be.lessThan(axisPosition.right);
            });
            distanceBetweenElementAndDataLabelIsOffset(
              labelPosition.left - barPosition.right
            );
          }
        );
      });
      it('uses the default text color (black) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [1, 3]);
      });
    });

    describe('for zero or non-numeric values', () => {
      it('offsets data label to the right of scales.x(0)', () => {
        assertPositionOfTickForZeroAndDataLabel(
          'x',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            distanceBetweenElementAndDataLabelIsOffset(
              labelPosition.left - tickPosition.right
            );
          },
          [4, 5]
        );
      });
      it('uses the default text color (black) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [4]);
      });
    });
  });

  describe('for data that has negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<Datum, string>()
        .data(dataWithNegativeZeroAndNonnumericValues)
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.value).domainPaddingPixels(4)
            )
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .color((dimension) =>
          dimension.valueAccessor(() => '').range(['#000080'])
        )
        .labels((labels) => labels.display(true).offset(labelOffset))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
    });
    it('offsets data label for the non-numeric value to the left of scales.x(0)', () => {
      assertPositionOfTickForZeroAndDataLabel(
        'x',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            tickPosition.left - labelPosition.right
          );
        },
        [2, 3]
      );
    });
    it('uses the default text color (black) for the zero and non-numeric labels color', () => {
      barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [2, 3]);
    });
  });

  describe('for bar data that has positive, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<Datum, string>()
        .data(dataWithPositiveZeroAndNonnumericValues)
        .horizontal((bars) =>
          bars
            .x((dimension) =>
              dimension.valueAccessor((d) => d.value).domainPaddingPixels(4)
            )
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .color((dimension) =>
          dimension.valueAccessor(() => '').range(['#000080'])
        )
        .labels((labels) => labels.display(true).offset(labelOffset))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
    });
    it('offsets data label for the non-numeric value to the right of scales.x(0)', () => {
      assertPositionOfTickForZeroAndDataLabel(
        'x',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            labelPosition.left - tickPosition.right
          );
        },
        [2, 3]
      );
    });
    it('uses the default text color (black) for the zero and non-numeric labels color', () => {
      barLabelColorMatchesExpectedRgb(defaultTextColorRgb, [2, 3]);
    });
  });

  [
    { data: dataWithNonnumericValues, valueType: 'non-numeric' },
    { data: dataWithZeroValues, valueType: 'zero' },
    {
      data: dataWithZeroAndNonnumericValues,
      valueType: 'non-numeric and zero',
    },
  ].forEach((item) => {
    describe(`for bar data that only has ${item.valueType} values`, () => {
      describe('when the domain maximum value is positive', () => {
        beforeEach(() => {
          barsConfig = new VicBarsConfigBuilder<Datum, string>()
            .data(item.data)
            .horizontal((bars) =>
              bars
                .x((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .domain([-10, 10])
                    .domainPaddingPixels(4)
                )
                .y((dimension) => dimension.valueAccessor((d) => d.state))
            )
            .color((dimension) =>
              dimension.valueAccessor(() => '').range(['#000080'])
            )
            .labels((labels) => labels.display(true).offset(labelOffset))
            .getConfig();
          mountHorizontalBarsComponent(barsConfig);
        });
        it('offsets data label to the right of scales.x(0)', () => {
          assertPositionOfTickForZeroAndDataLabel(
            'x',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                labelPosition.left - tickPosition.right
              );
            }
          );
        });
        it('uses the default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(defaultTextColorRgb);
        });
      });
      describe('when the domain maximum value is not greater than 0', () => {
        beforeEach(() => {
          barsConfig = new VicBarsConfigBuilder<Datum, string>()
            .data(item.data)
            .horizontal((bars) =>
              bars
                .x((dimension) =>
                  dimension
                    .valueAccessor((d) => d.value)
                    .domain([-10, 0])
                    .domainPaddingPixels(4)
                )
                .y((dimension) => dimension.valueAccessor((d) => d.state))
            )
            .color((dimension) =>
              dimension.valueAccessor(() => '').range(['#000080'])
            )
            .labels((labels) => labels.display(true).offset(labelOffset))
            .getConfig();
          mountHorizontalBarsComponent(barsConfig);
        });
        it('offsets data label to the left of scales.x(0)', () => {
          assertPositionOfTickForZeroAndDataLabel(
            'x',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                tickPosition.left - labelPosition.right
              );
            }
          );
        });
        it('uses the default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(defaultTextColorRgb);
        });
      });
    });
  });
});
