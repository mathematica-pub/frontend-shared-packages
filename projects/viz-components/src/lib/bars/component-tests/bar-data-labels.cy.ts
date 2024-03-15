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
  VicVerticalBarChartDimensionsConfig,
} from '../../bars/bars.config';

const data = [
  { state: 'Alabama', value: -10 },
  { state: 'Alaska', value: -8 },
  { state: 'Arizona', value: 10 },
  { state: 'Arkansas', value: 8 },
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

//TODO: double check label offset math, update it block statements

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
  @Input() barsConfig: VicBarsConfig;
  @Input() xOrdinalAxisConfig: VicAxisConfig;
  @Input() yQuantitativeAxisConfig: VicAxisConfig;
  margin = { top: 20, right: 20, bottom: 0, left: 40 };
}

describe('it correctly positions the vertical bar chart data labels', () => {
  let barsConfig: VicBarsConfig;
  let xAxisConfig: VicAxisConfig;
  let yAxisConfig: VicAxisConfig;
  const declarations = [TestVerticalBarWithLabelsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicVerticalBarChartDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.data = data;
    barsConfig.category.colors = ['#000080'];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    barsConfig.labels.offset = labelOffset;
    barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig();
    barsConfig.quantitative.domainPadding.numPixels = 4;
    xAxisConfig = new VicAxisConfig();
    yAxisConfig = new VicAxisConfig();
    yAxisConfig.tickFormat = '.0f';

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
  });

  describe('when there is not enough vertical space between the bar and chart edge', () => {
    it('places data label for negative value completely inside the bar', () => {
      assertPositionOfBarAndDataLabel(
        0,
        (barPosition: DOMRect, labelPosition: DOMRect) => {
          expect(labelPosition.top).to.be.greaterThan(barPosition.top);
          expect(labelPosition.bottom).to.be.lessThan(barPosition.bottom);
          expect(barPosition.bottom - labelPosition.bottom).to.be.most(
            labelOffset
          );
        }
      );
    });
    it('places data label for positive value completely inside the bar', () => {
      assertPositionOfBarAndDataLabel(
        2,
        (barPosition: DOMRect, labelPosition: DOMRect) => {
          expect(labelPosition.top).to.be.greaterThan(barPosition.top);
          expect(labelPosition.bottom).to.be.lessThan(barPosition.bottom);
          expect(labelPosition.top - barPosition.top).to.be.most(labelOffset);
        }
      );
    });
    it('colors data labels with the lighter default text color', () => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (i === 0 || i === 2) {
          expect($label).to.have.attr('fill', '#ffffff');
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
          expect(labelPosition.top - barPosition.bottom).to.be.most(
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
          expect(barPosition.top - labelPosition.bottom).to.be.most(
            labelOffset
          );
        }
      );
    });
    it('colors data labels with the darker default text color', () => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (i === 1 || i === 3) {
          expect($label).to.have.attr('fill', '#000000');
        }
      });
    });
  });

  describe('when the data label corresponds to a falsy value', () => {
    it('offsets data label above scales.x(0)', () => {
      cy.get('.vic-bar-label')
        .eq(4)
        .then(($label) => {
          cy.get('.vic-y.vic-axis-g .tick text')
            .contains(/^0$/)
            .siblings()
            .then(($tick) => {
              const labelPosition = $label[0].getBoundingClientRect();
              const tickPosition = $tick[0].getBoundingClientRect();
              expect(labelPosition.bottom).to.be.lessThan(tickPosition.y);
              expect(tickPosition.y - labelPosition.bottom).to.be.most(
                labelOffset
              );
            });
        });
    });
    it('colors falsy data label with the darker default text color', () => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (i === 4) {
          expect($label).to.have.attr('fill', '#000000');
        }
      });
    });
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
});

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
  @Input() barsConfig: VicBarsConfig;
  @Input() xQuantitativeAxisConfig: VicAxisConfig;
  @Input() yOrdinalAxisConfig: VicAxisConfig;
  margin = { top: 20, right: 20, bottom: 20, left: 60 };
}

describe('it correctly positions the horizontal bar chart data labels', () => {
  let barsConfig: VicBarsConfig;
  let xAxisConfig: VicAxisConfig;
  let yAxisConfig: VicAxisConfig;
  const declarations = [TestHorizontalBarWithLabelsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.data = data;
    barsConfig.category.colors = ['#000080'];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    barsConfig.labels.offset = labelOffset;
    barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig();
    barsConfig.quantitative.domainPadding.numPixels = 4;
    xAxisConfig = new VicAxisConfig();
    xAxisConfig.tickFormat = '.0f';
    yAxisConfig = new VicAxisConfig();

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
  });

  describe('when there is not enough horizontal space between the bar and chart edge', () => {
    it('places data label for negative value completely inside the bar', () => {
      assertPositionOfBarAndDataLabel(
        0,
        (barPosition: DOMRect, labelPosition: DOMRect) => {
          expect(labelPosition.left).to.be.greaterThan(barPosition.left);
          expect(labelPosition.right).to.be.lessThan(barPosition.right);
          expect(labelPosition.left - barPosition.left).to.be.most(labelOffset);
        }
      );
    });
    it('places data label for positive value completely inside the bar', () => {
      assertPositionOfBarAndDataLabel(
        2,
        (barPosition: DOMRect, labelPosition: DOMRect) => {
          expect(labelPosition.left).to.be.greaterThan(barPosition.left);
          expect(labelPosition.right).to.be.lessThan(barPosition.right);
          expect(barPosition.right - labelPosition.right).to.be.most(
            labelOffset
          );
        }
      );
    });
    it('colors data labels with the lighter default text color', () => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (i === 0 || i === 2) {
          expect($label).to.have.attr('fill', '#ffffff');
        }
      });
    });
  });

  describe('when there is ample horizontal space between the bar and the chart edge', () => {
    it('places data label for negative value left of the bar and right of the chart edge', () => {
      assertPositionOfBarAndDataLabel(
        1,
        (barPosition: DOMRect, labelPosition: DOMRect) => {
          expect(labelPosition.right).to.be.lessThan(barPosition.left);
          cy.get('.vic-x.vic-axis-g').then(($axis) => {
            const axisPosition = $axis[0].getBoundingClientRect();
            expect(labelPosition.left).to.be.greaterThan(axisPosition.right);
          });
          expect(barPosition.left - labelPosition.right).to.be.most(
            labelOffset
          );
        }
      );
    });
    it('places data label for positive value right of the bar and left of the chart edge', () => {
      assertPositionOfBarAndDataLabel(
        3,
        (barPosition: DOMRect, labelPosition: DOMRect) => {
          expect(labelPosition.left).to.be.greaterThan(barPosition.right);
          cy.get('.vic-x.vic-axis-g').then(($axis) => {
            const axisPosition = $axis[0].getBoundingClientRect();
            expect(labelPosition.right).to.be.lessThan(axisPosition.right);
          });
          expect(labelPosition.left - barPosition.right).to.be.most(
            labelOffset
          );
        }
      );
    });
    it('colors data labels with the darker default text color', () => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (i === 1 || i === 3) {
          expect($label).to.have.attr('fill', '#000000');
        }
      });
    });
  });

  describe('when the data label corresponds to a falsy value', () => {
    it('offsets data label above scales.y(0)', () => {
      cy.get('.vic-bar-label')
        .eq(4)
        .then(($label) => {
          cy.get('.vic-x.vic-axis-g .tick text')
            .contains(/^0$/)
            .siblings()
            .then(($tick) => {
              const labelPosition = $label[0].getBoundingClientRect();
              const tickPosition = $tick[0].getBoundingClientRect();
              expect(labelPosition.left).to.be.greaterThan(tickPosition.x);
              expect(labelPosition.left - tickPosition.x).to.be.most(
                labelOffset
              );
            });
        });
    });
    it('colors data label with the darker default text color', () => {
      cy.get('.vic-bar-label').each(($label, i) => {
        if (i === 4) {
          expect($label).to.have.attr('fill', '#000000');
        }
      });
    });
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
});
