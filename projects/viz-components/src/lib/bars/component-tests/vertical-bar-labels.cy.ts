import { Component, Input } from '@angular/core';
import 'cypress/support/component';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';

import {
  VicBarsModule,
  VicChartModule,
  VicPixelDomainPaddingConfig,
  VicXOrdinalAxisModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { VicAxisConfig } from '../../axes/axis.config';
import {
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicVerticalBarChartDimensionsConfig,
} from '../../bars/bars.config';

const assertBarLabelPositionIsCorrect = (
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

describe('it correctly positions the data labels for a vertical bar chart', () => {
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
  const data = [
    { state: 'Alabama', value: -10 },
    { state: 'Alaska', value: -8 },
    { state: 'Arizona', value: 10 },
    { state: 'Arkansas', value: 8 },
    { state: 'California', value: null },
  ];
  const labelOffset = 6;
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

  it('positions negative value data label inside bar if there is not ample domain padding', () => {
    assertBarLabelPositionIsCorrect(
      0,
      (barPosition: DOMRect, labelPosition: DOMRect) => {
        expect(barPosition.bottom).to.be.greaterThan(labelPosition.bottom);
        expect(barPosition.top).to.be.lessThan(labelPosition.top);
      }
    );
  });
  it('positions negative value data label outside bar if there is ample domain padding', () => {
    assertBarLabelPositionIsCorrect(
      1,
      (barPosition: DOMRect, labelPosition: DOMRect) => {
        expect(barPosition.bottom).to.be.lessThan(labelPosition.top);
      }
    );
  });
  it('positions positive value data label inside bar if there is not ample domain padding', () => {
    assertBarLabelPositionIsCorrect(
      2,
      (barPosition: DOMRect, labelPosition: DOMRect) => {
        expect(barPosition.bottom).to.be.greaterThan(labelPosition.bottom);
        expect(barPosition.top).to.be.lessThan(labelPosition.top);
      }
    );
  });
  it('positions positive value data label outside bar if there is ample domain padding', () => {
    assertBarLabelPositionIsCorrect(
      3,
      (barPosition: DOMRect, labelPosition: DOMRect) => {
        expect(barPosition.top).to.be.greaterThan(labelPosition.bottom);
      }
    );
  });

  // it('correctly positions the bar labels horizontally', () => {
  //   cy.get('.vic-bar')
  //     .first()
  //     .invoke('attr', 'width')
  //     .then((width) => {
  //       cy.get('.vic-bar-label').each((el) => {
  //         cy.wrap(el)
  //           .invoke('attr', 'x')
  //           .should('equal', `${parseFloat(width) / 2}`);
  //         cy.wrap(el).invoke('attr', 'text-anchor').should('equal', 'middle');
  //       });
  //     });
  // });

  // describe('positions the label inside the bar without ample domain padding', () => {
  //   it('negative values', () => {
  //     const index = data.findIndex((x) => x.value === dataExtent[0]);

  //     cy.get('.vic-bar-label')
  //       .eq(index)
  //       .then((el) => {
  //         cy.wrap(el)
  //           .prev('rect')
  //           .invoke('attr', 'height')
  //           .then((height) => {
  //             cy.wrap(el)
  //               .invoke('attr', 'y')
  //               .should('equal', (parseFloat(height) - labelOffset).toString());
  //           });
  //         cy.wrap(el).invoke('attr', 'fill').should('equal', '#ffffff');
  //         cy.wrap(el)
  //           .invoke('attr', 'dominant-baseline')
  //           .should('equal', 'alphabetical');
  //       });
  //   });

  //   it('positive values', () => {
  //     const index = data.findIndex((x) => x.value === dataExtent[1]);
  //     cy.get('.vic-bar-label')
  //       .eq(index)
  //       .then((el) => {
  //         cy.wrap(el)
  //           .invoke('attr', 'y')
  //           .should('equal', labelOffset.toString());
  //         cy.wrap(el).invoke('attr', 'fill').should('equal', '#ffffff');
  //         cy.wrap(el)
  //           .invoke('attr', 'dominant-baseline')
  //           .should('equal', 'hanging');
  //       });
  //   });
  // });

  // describe('positions the label outside the bar with ample domain padding', () => {
  //   it('negative values', () => {
  //     const index = data.findIndex(
  //       (x) => x.value !== dataExtent[0] && x.value < 0
  //     );
  //     cy.get('.vic-bar-label')
  //       .eq(index)
  //       .then((el) => {
  //         cy.wrap(el)
  //           .prev('rect')
  //           .invoke('attr', 'height')
  //           .then((height) => {
  //             cy.wrap(el)
  //               .invoke('attr', 'y')
  //               .should('equal', (parseFloat(height) + labelOffset).toString());
  //           });
  //         cy.wrap(el).invoke('attr', 'fill').should('equal', '#000000');
  //         cy.wrap(el)
  //           .invoke('attr', 'dominant-baseline')
  //           .should('equal', 'hanging');
  //       });
  //   });

  //   it('positive values', () => {
  //     const index = data.findIndex(
  //       (x) => x.value !== dataExtent[1] && x.value > 0
  //     );
  //     cy.get('.vic-bar-label')
  //       .eq(index)
  //       .then((el) => {
  //         cy.wrap(el).invoke('attr', 'y').should('equal', `-${labelOffset}`);
  //         cy.wrap(el).invoke('attr', 'fill').should('equal', '#000000');
  //         cy.wrap(el)
  //           .invoke('attr', 'dominant-baseline')
  //           .should('equal', 'alphabetical');
  //       });
  //   });
  // });
});
