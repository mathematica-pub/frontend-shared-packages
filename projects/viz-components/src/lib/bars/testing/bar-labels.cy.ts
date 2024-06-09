/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import 'cypress/support/component';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import {
  VicBarsConfig,
  VicXQuantitativeAxisModule,
  VicYOrdinalAxisModule,
  vicBarsLabels,
  vicHorizontalBars,
  vicVerticalBars,
  vicXQuantitativeAxis,
  vicYOrdinalAxis,
} from '../../../public-api';
import { VicOrdinalAxisConfig } from '../../axes/ordinal/ordinal-axis.config';
import { VicQuantitativeAxisConfig } from '../../axes/quantitative/quantitative-axis.config';
import { vicXOrdinalAxis } from '../../axes/x-ordinal/x-ordinal-axis.config';
import { VicXOrdinalAxisModule } from '../../axes/x-ordinal/x-ordinal-axis.module';
import { vicYQuantitativeAxis } from '../../axes/y-quantitative-axis/y-quantitative-axis.config';
import { VicYQuantitativeAxisModule } from '../../axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicChartModule } from '../../chart/chart.module';
import { vicCategoricalDimension } from '../../data-dimensions/categorical-dimension';
import { vicPixelDomainPadding } from '../../data-dimensions/domain-padding/pixel-padding';
import { vicOrdinalDimension } from '../../data-dimensions/ordinal-dimension';
import { vicQuantitativeDimension } from '../../data-dimensions/quantitative-dimension';
import { VicXyChartModule } from '../../xy-chart/xy-chart.module';
import { VicBarsModule } from '../bars.module';

type Datum = { state: string; value: number };

const dataWithAllValueTypes = [
  { state: 'Alabama', value: -10 },
  { state: 'Alaska', value: -8 },
  { state: 'Arizona', value: 10 },
  { state: 'Arkansas', value: 8 },
  { state: 'California', value: null },
  { state: 'Colorado', value: 0 },
];
const dataWithNegativeZeroAndNonnumericValues = [
  { state: 'Alabama', value: -10 },
  { state: 'Alaska', value: -8 },
  { state: 'Arizona', value: null },
  { state: 'Arkansas', value: 0 },
];
const dataWithPositiveZeroAndNonnumericValues = [
  { state: 'Alabama', value: 10 },
  { state: 'Alaska', value: 8 },
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
const labelOffset = 6;
const elementPositionDelta = 0.5;
const darkTextColorRgb = 'rgb(0, 0, 0)';
const lightTextColorRgb = 'rgb(255, 255, 255)';

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
  indices?: number[]
): void => {
  cy.get(`.vic-${axis}.vic-axis-g .tick text`)
    .contains(/^0$/)
    .siblings()
    .then(($tick) => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (indices === undefined || indices.includes(i)) {
          const tickPosition = $tick[0].getBoundingClientRect();
          const labelPosition = $label[0].getBoundingClientRect();
          assertions(tickPosition, labelPosition);
        }
      });
    });
};

const distanceBetweenElementAndDataLabelIsOffset = (distance: number) => {
  expect(distance).to.be.closeTo(labelOffset, elementPositionDelta);
};

const barLabelColorMatchesExpectedRgb = (
  rgb: string,
  indices?: number[]
): void => {
  cy.get('.vic-bar-label').each(($label, i) => {
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
class TestVerticalBarsWithLabelsComponent {
  @Input() barsConfig: VicBarsConfig<Datum, string>;
  @Input() xOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() yQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = { top: 20, right: 20, bottom: 0, left: 40 };
}

const mountVerticalBarsComponent = (
  barsConfig: VicBarsConfig<Datum, string>
): void => {
  const xAxisConfig = vicXOrdinalAxis();
  const yAxisConfig = vicYQuantitativeAxis({
    tickFormat: '.0f',
  });

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
  cy.wait(100);
};

describe('it correctly positions the vertical bar chart data labels', () => {
  let barsConfig: VicBarsConfig<Datum, string>;
  describe('for bar data that has positive, negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = vicVerticalBars({
        data: dataWithAllValueTypes,
        ordinal: vicOrdinalDimension({
          valueAccessor: (d) => d.state,
        }),
        quantitative: vicQuantitativeDimension({
          valueAccessor: (d) => d.value,
          domainPadding: vicPixelDomainPadding({
            numPixels: -4,
          }),
        }),
        categorical: vicCategoricalDimension({
          valueAccessor: () => '',
          range: ['#000080'],
        }),
        labels: vicBarsLabels({
          display: true,
          offset: labelOffset,
        }),
      });
      mountVerticalBarsComponent(barsConfig);
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
                labelPosition.width / 2 + labelPosition.left
              ).to.be.closeTo(
                tickPosition.width / 2 + tickPosition.left,
                elementPositionDelta
              );
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
      it('uses the lighter default text color (white) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(lightTextColorRgb, [0, 2]);
      });
    });

    describe('when there is ample vertical space between the bar and the chart edge', () => {
      it('places data label for negative value in between bar and the bottom chart edge', () => {
        assertPositionOfBarAndDataLabel(
          1,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.top).to.be.greaterThan(barPosition.bottom);
            cy.get('.vic-y.vic-axis-g').then(($axis) => {
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
            cy.get('.vic-y.vic-axis-g').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.top).to.be.greaterThan(axisPosition.top);
            });
            distanceBetweenElementAndDataLabelIsOffset(
              barPosition.top - labelPosition.bottom
            );
          }
        );
      });
      it('uses the darker default text color (black) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(darkTextColorRgb, [1, 3]);
      });
    });

    describe('when the data label is for a zero or non-numeric value', () => {
      it('offsets data label above scales.y(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'y',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            distanceBetweenElementAndDataLabelIsOffset(
              tickPosition.top - labelPosition.bottom
            );
          },
          [4, 5]
        );
      });
      it('uses the darker default text color (black) for the data label color', () => {
        barLabelColorMatchesExpectedRgb(darkTextColorRgb, [4, 5]);
      });
    });
  });

  describe('for bar data that has negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = vicVerticalBars({
        data: dataWithNegativeZeroAndNonnumericValues,
        ordinal: vicOrdinalDimension({
          valueAccessor: (d) => d.state,
        }),
        quantitative: vicQuantitativeDimension({
          valueAccessor: (d) => d.value,
          domainPadding: vicPixelDomainPadding({
            numPixels: -4,
          }),
        }),
        categorical: vicCategoricalDimension({
          valueAccessor: () => '',
          range: ['#000080'],
        }),
        labels: vicBarsLabels({
          display: true,
          offset: labelOffset,
        }),
      });
      mountVerticalBarsComponent(barsConfig);
    });
    it('offsets data label for zero and non-numerics value below scales.y(0)', () => {
      assertPositionOfZeroAxisAndDataLabel(
        'y',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            labelPosition.top - tickPosition.bottom
          );
        },
        [2, 3]
      );
    });
    it('uses the darker default text color (black) for the zero and non-numeric label color', () => {
      barLabelColorMatchesExpectedRgb(darkTextColorRgb, [2, 3]);
    });
  });

  describe('for bar data that has positive, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = vicVerticalBars({
        data: dataWithPositiveZeroAndNonnumericValues,
        ordinal: vicOrdinalDimension({
          valueAccessor: (d) => d.state,
        }),
        quantitative: vicQuantitativeDimension({
          valueAccessor: (d) => d.value,
          domainPadding: vicPixelDomainPadding({
            numPixels: -4,
          }),
        }),
        categorical: vicCategoricalDimension({
          valueAccessor: () => '',
          range: ['#000080'],
        }),
        labels: vicBarsLabels({
          display: true,
          offset: labelOffset,
        }),
      });
      mountVerticalBarsComponent(barsConfig);
    });
    it('offsets data label for zero and non-numeric values above scales.y(0)', () => {
      assertPositionOfZeroAxisAndDataLabel(
        'y',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            tickPosition.top - labelPosition.bottom
          );
        },
        [2, 3]
      );
    });
    it('uses the darker default text color (black) for the zero and non-numeric label color', () => {
      barLabelColorMatchesExpectedRgb(darkTextColorRgb, [2, 3]);
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
          barsConfig = vicVerticalBars({
            data: item.data,
            ordinal: vicOrdinalDimension({
              valueAccessor: (d) => d.state,
            }),
            quantitative: vicQuantitativeDimension({
              valueAccessor: (d) => d.value,
              domain: [-10, 10],
              domainPadding: vicPixelDomainPadding({
                numPixels: -4,
              }),
            }),
            categorical: vicCategoricalDimension({
              valueAccessor: () => '',
              range: ['#000080'],
            }),
            labels: vicBarsLabels({
              display: true,
              offset: labelOffset,
            }),
          });
          mountVerticalBarsComponent(barsConfig);
        });
        it('offsets data label above scales.y(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'y',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                tickPosition.top - labelPosition.bottom
              );
            }
          );
        });
        it('uses the darker default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(darkTextColorRgb);
        });
      });
      describe('when the domain maximum is not greater than 0', () => {
        beforeEach(() => {
          barsConfig = vicVerticalBars({
            data: item.data,
            ordinal: vicOrdinalDimension({
              valueAccessor: (d) => d.state,
            }),
            quantitative: vicQuantitativeDimension({
              valueAccessor: (d) => d.value,
              domain: [-10, 0],
              domainPadding: vicPixelDomainPadding({
                numPixels: -4,
              }),
            }),
            categorical: vicCategoricalDimension({
              valueAccessor: () => '',
              range: ['#000080'],
            }),
            labels: vicBarsLabels({
              display: true,
              offset: labelOffset,
            }),
          });
          mountVerticalBarsComponent(barsConfig);
        });
        it('offsets data label below scales.y(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'y',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                labelPosition.top - tickPosition.bottom
              );
            }
          );
        });
        it('uses the darker default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(darkTextColorRgb);
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
class TestHorizontalBarsWithLabelsComponent {
  @Input() barsConfig: VicBarsConfig<Datum, string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  @Input() yOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  margin = { top: 20, right: 20, bottom: 20, left: 60 };
}

const mountHorizontalBarsComponent = (
  barsConfig: VicBarsConfig<Datum, string>
): void => {
  const xAxisConfig = vicXQuantitativeAxis({
    tickFormat: '.0f',
  });
  const yAxisConfig = vicYOrdinalAxis();

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
  cy.wait(100);
};

describe('it correctly positions the horizontal bar chart data labels', () => {
  let barsConfig: VicBarsConfig<Datum, string>;
  describe('for bar data that has positive, negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = vicHorizontalBars({
        data: dataWithAllValueTypes,
        ordinal: vicOrdinalDimension({
          valueAccessor: (d) => d.state,
        }),
        quantitative: vicQuantitativeDimension({
          valueAccessor: (d) => d.value,
          domainPadding: vicPixelDomainPadding({
            numPixels: 4,
          }),
        }),
        categorical: vicCategoricalDimension({
          valueAccessor: () => '',
          range: ['#000080'],
        }),
        labels: vicBarsLabels({
          display: true,
          offset: labelOffset,
        }),
      });
      mountHorizontalBarsComponent(barsConfig);
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
                labelPosition.height / 2 + labelPosition.top
              ).to.be.closeTo(
                tickPosition.height / 2 + tickPosition.top,
                elementPositionDelta
              );
            });
        });
      });
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
      it('uses the lighter default text color (white) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(lightTextColorRgb, [0, 2]);
      });
    });

    describe('for values that result in sufficient space for the label between bar end and chart edge', () => {
      it('places data label for negative value in between bar and the left chart edge', () => {
        assertPositionOfBarAndDataLabel(
          1,
          (barPosition: DOMRect, labelPosition: DOMRect) => {
            expect(labelPosition.right).to.be.lessThan(barPosition.left);
            cy.get('.vic-x.vic-axis-g').then(($axis) => {
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
            cy.get('.vic-x.vic-axis-g').then(($axis) => {
              const axisPosition = $axis[0].getBoundingClientRect();
              expect(labelPosition.right).to.be.lessThan(axisPosition.right);
            });
            distanceBetweenElementAndDataLabelIsOffset(
              labelPosition.left - barPosition.right
            );
          }
        );
      });
      it('uses the darker default text color (black) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(darkTextColorRgb, [1, 3]);
      });
    });

    describe('for zero or non-numeric values', () => {
      it('offsets data label to the right of scales.x(0)', () => {
        assertPositionOfZeroAxisAndDataLabel(
          'x',
          (tickPosition: DOMRect, labelPosition: DOMRect) => {
            distanceBetweenElementAndDataLabelIsOffset(
              labelPosition.left - tickPosition.right
            );
          },
          [4, 5]
        );
      });
      it('uses the darker default text color (black) for the data labels color', () => {
        barLabelColorMatchesExpectedRgb(darkTextColorRgb, [4]);
      });
    });
  });

  describe('for data that has negative, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = vicHorizontalBars({
        data: dataWithNegativeZeroAndNonnumericValues,
        ordinal: vicOrdinalDimension({
          valueAccessor: (d) => d.state,
        }),
        quantitative: vicQuantitativeDimension({
          valueAccessor: (d) => d.value,
          domainPadding: vicPixelDomainPadding({
            numPixels: 4,
          }),
        }),
        categorical: vicCategoricalDimension({
          valueAccessor: () => '',
          range: ['#000080'],
        }),
        labels: vicBarsLabels({
          display: true,
          offset: labelOffset,
        }),
      });
      mountHorizontalBarsComponent(barsConfig);
    });
    it('offsets data label for the non-numeric value to the left of scales.x(0)', () => {
      assertPositionOfZeroAxisAndDataLabel(
        'x',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            tickPosition.left - labelPosition.right
          );
        },
        [2, 3]
      );
    });
    it('uses the darker default text color (black) for the zero and non-numeric labels color', () => {
      barLabelColorMatchesExpectedRgb(darkTextColorRgb, [2, 3]);
    });
  });

  describe('for bar data that has positive, zero, and non-numeric values', () => {
    beforeEach(() => {
      barsConfig = vicHorizontalBars({
        data: dataWithPositiveZeroAndNonnumericValues,
        ordinal: vicOrdinalDimension({
          valueAccessor: (d) => d.state,
        }),
        quantitative: vicQuantitativeDimension({
          valueAccessor: (d) => d.value,
          domainPadding: vicPixelDomainPadding({
            numPixels: 4,
          }),
        }),
        categorical: vicCategoricalDimension({
          valueAccessor: () => '',
          range: ['#000080'],
        }),
        labels: vicBarsLabels({
          display: true,
          offset: labelOffset,
        }),
      });
      mountHorizontalBarsComponent(barsConfig);
    });
    it('offsets data label for the non-numeric value to the right of scales.x(0)', () => {
      assertPositionOfZeroAxisAndDataLabel(
        'x',
        (tickPosition: DOMRect, labelPosition: DOMRect) => {
          distanceBetweenElementAndDataLabelIsOffset(
            labelPosition.left - tickPosition.right
          );
        },
        [2, 3]
      );
    });
    it('uses the darker default text color (black) for the zero and non-numeric labels color', () => {
      barLabelColorMatchesExpectedRgb(darkTextColorRgb, [2, 3]);
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
          barsConfig = vicHorizontalBars({
            data: item.data,
            ordinal: vicOrdinalDimension({
              valueAccessor: (d) => d.state,
            }),
            quantitative: vicQuantitativeDimension({
              valueAccessor: (d) => d.value,
              domain: [-10, 10],
              domainPadding: vicPixelDomainPadding({
                numPixels: 4,
              }),
            }),
            categorical: vicCategoricalDimension({
              valueAccessor: () => '',
              range: ['#000080'],
            }),
            labels: vicBarsLabels({
              display: true,
              offset: labelOffset,
            }),
          });
          mountHorizontalBarsComponent(barsConfig);
        });
        it('offsets data label to the right of scales.x(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'x',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                labelPosition.left - tickPosition.right
              );
            }
          );
        });
        it('uses the darker default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(darkTextColorRgb);
        });
      });
      describe('when the domain maximum value is not greater than 0', () => {
        beforeEach(() => {
          barsConfig = vicHorizontalBars({
            data: item.data,
            ordinal: vicOrdinalDimension({
              valueAccessor: (d) => d.state,
            }),
            quantitative: vicQuantitativeDimension({
              valueAccessor: (d) => d.value,
              domain: [-10, 0],
              domainPadding: vicPixelDomainPadding({
                numPixels: 4,
              }),
            }),
            categorical: vicCategoricalDimension({
              valueAccessor: () => '',
              range: ['#000080'],
            }),
            labels: vicBarsLabels({
              display: true,
              offset: labelOffset,
            }),
          });
          mountHorizontalBarsComponent(barsConfig);
        });
        it('offsets data label to the left of scales.x(0)', () => {
          assertPositionOfZeroAxisAndDataLabel(
            'x',
            (tickPosition: DOMRect, labelPosition: DOMRect) => {
              distanceBetweenElementAndDataLabelIsOffset(
                tickPosition.left - labelPosition.right
              );
            }
          );
        });
        it('uses the darker default text color (black) for the data labels color', () => {
          barLabelColorMatchesExpectedRgb(darkTextColorRgb);
        });
      });
    });
  });
});
