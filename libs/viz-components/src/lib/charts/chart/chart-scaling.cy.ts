import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ChartConfig,
  DotsConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicDotsConfigBuilder,
  VicDotsModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { cy, describe, expect, it } from 'local-cypress';
import {
  CountryFactsDatum,
  countryFactsData,
} from '../../testing/data/country-area-continent';

export function getDotTransform(
  selector = '.vic-dots-group'
): Cypress.Chainable<{ x: number; y: number }> {
  return cy
    .get(selector)
    .first()
    .invoke('attr', 'transform')
    .then((t) => {
      const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(t);
      if (!match) throw new Error(`Failed to parse transform string: ${t}`);
      return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
      };
    });
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-svg-attr-test-component',
  template: `
    <div [style.width.px]="containerWidth">
      <vic-chart [config]="chartConfig">
        <ng-container svg-elements>
          <svg:rect
            x="50"
            y="50"
            width="100"
            height="100"
            fill="tomato"
          ></svg:rect>
        </ng-container>
      </vic-chart>
    </div>
  `,
  imports: [CommonModule, VicChartModule],
})
class SvgAttrTestComponent {
  @Input() chartConfig: ChartConfig;
  @Input() containerWidth = 400;
}

describe('ChartComponent SVG attributes by scalingStrategy', () => {
  const baseConfig = new VicChartConfigBuilder()
    .maxWidth(400)
    .maxHeight(300)
    .margin({ top: 20, right: 20, bottom: 20, left: 20 });

  function mountWithStrategy(
    strategy: 'fixed' | 'responsive-width' | 'viewbox'
  ) {
    const config = baseConfig.scalingStrategy(strategy).getConfig();

    cy.mount(SvgAttrTestComponent, {
      componentProperties: { chartConfig: config },
    });
    cy.wait(50);
  }

  it('applies fixed scaling with static width and height', () => {
    mountWithStrategy('fixed');
    cy.get('svg')
      .should('have.attr', 'width', '400')
      .and('have.attr', 'height', '300')
      .and('not.have.attr', 'viewBox');
  });

  it('applies responsive-width scaling with dynamic width and aspect-ratio-derived height', () => {
    mountWithStrategy('responsive-width');
    cy.get('svg').should('not.have.attr', 'viewBox');
    cy.get('svg')
      .invoke('attr', 'width')
      .should('not.be.null')
      .then(Number)
      .should('be.lte', 400);
    cy.get('svg')
      .invoke('attr', 'height')
      .should('not.be.null')
      .then(Number)
      .should('be.gt', 0);
  });

  it('applies viewbox scaling with no width/height but a viewBox attribute', () => {
    mountWithStrategy('viewbox');
    cy.get('svg')
      .should('have.attr', 'viewBox', '0 0 400 300')
      .and('not.have.attr', 'width');
    cy.get('svg')
      .invoke('attr', 'height')
      .should('be.oneOf', [null, undefined]);
    cy.get('svg').should('have.class', 'vic-chart-viewbox');
  });

  it('respects user-supplied aspectRatio override in responsive-width mode', () => {
    const config = baseConfig
      .scalingStrategy('responsive-width')
      .aspectRatio(2)
      .getConfig();

    cy.mount(SvgAttrTestComponent, {
      componentProperties: { chartConfig: config },
    });

    cy.wait(50);
    cy.get('svg')
      .invoke('attr', 'width')
      .should('not.be.null')
      .then(Number)
      .then((width) => {
        cy.get('svg')
          .invoke('attr', 'height')
          .should('not.be.null')
          .then(Number)
          .should('be.closeTo', width / 2, 1);
      });
  });

  it('updates height when user provides a new config', () => {
    const initialConfig = baseConfig.scalingStrategy('fixed').getConfig();

    cy.mount(SvgAttrTestComponent, {
      componentProperties: { chartConfig: initialConfig },
    }).then(({ component, fixture }) => {
      cy.wait(50);

      const updatedConfig = new VicChartConfigBuilder()
        .maxWidth(400)
        .maxHeight(200)
        .scalingStrategy('fixed')
        .getConfig();

      component.chartConfig = updatedConfig;
      fixture.detectChanges();
    });

    cy.wait(100);
    cy.get('svg').should('have.attr', 'height', '200');
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-scaling-strategy-test',
  template: `
    <div
      [style.width.px]="containerWidth"
      [style.height.px]="containerHeight"
      class="test-wrapper"
    >
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
          <svg:g vic-primary-marks-dots [config]="dotsConfig"></svg:g>
        </ng-container>
      </vic-xy-chart>
    </div>
  `,
  imports: [CommonModule, VicChartModule, VicDotsModule, VicXyAxisModule],
})
export class ScalingStrategyTestComponent {
  @Input() chartConfig: ChartConfig;
  @Input() dotsConfig: DotsConfig<CountryFactsDatum>;
  @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  @Input() containerWidth = 400;
  @Input() containerHeight = null;
}

describe('ChartComponent scaling strategies', () => {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const baseConfig = new VicChartConfigBuilder()
    .maxWidth(400)
    .maxHeight(300)
    .margin(margin);

  function mountWithStrategy(
    strategy: ChartConfig['scalingStrategy'],
    containerWidth = 400,
    fixedHeight = false,
    containerHeight = null
  ) {
    const config = baseConfig
      .scalingStrategy(strategy)
      .fixedHeight(fixedHeight)
      .getConfig();
    const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f').count(5))
      .getConfig();
    const yAxisConfig =
      new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(countryFactsData)
      .xNumeric((x) => x.valueAccessor((d) => d.population))
      .yNumeric((y) => y.valueAccessor((d) => d.gdpPerCapita))
      .radiusNumeric((r) => r.valueAccessor((d) => d.popGrowth).range([4, 10]))
      .class((d) => d.country)
      .getConfig();

    cy.mount(ScalingStrategyTestComponent, {
      componentProperties: {
        chartConfig: config,
        xQuantitativeAxisConfig: xAxisConfig,
        yQuantitativeAxisConfig: yAxisConfig,
        dotsConfig,
        containerWidth,
        containerHeight,
      },
    });
  }

  it('applies fixed scaling with static width and height', () => {
    mountWithStrategy('fixed');
    cy.get('svg')
      .should('have.attr', 'width', '400')
      .and('have.attr', 'height', '300')
      .and('not.have.attr', 'viewBox');
  });

  it('applies responsive-width scaling with fixedHeight and updates mark positions when container resizes', () => {
    mountWithStrategy('responsive-width', 300, true);

    getDotTransform().then((originalPosition) => {
      // remount with wider container
      mountWithStrategy('responsive-width', 450, true);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.greaterThan(originalPosition.x);
        expect(newPosition.y).to.closeTo(originalPosition.y, 1);
      });

      // remount with narrower container
      mountWithStrategy('responsive-width', 200, true);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.lessThan(originalPosition.x);
        expect(newPosition.y).to.closeTo(originalPosition.y, 1);
      });
    });
  });

  function getDotTransform(
    selector = '.vic-dots-group'
  ): Cypress.Chainable<{ x: number; y: number }> {
    return cy
      .get(selector)
      .first()
      .invoke('attr', 'transform')
      .then((t) => {
        const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(t);
        if (!match) throw new Error(`Failed to parse transform string: ${t}`);
        return {
          x: parseFloat(match[1]),
          y: parseFloat(match[2]),
        };
      });
  }

  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-svg-attr-test-component',
    template: `
      <div [style.width.px]="containerWidth">
        <vic-chart [config]="chartConfig">
          <ng-container svg-elements>
            <svg:rect
              x="50"
              y="50"
              width="100"
              height="100"
              fill="tomato"
            ></svg:rect>
          </ng-container>
        </vic-chart>
      </div>
    `,
    imports: [CommonModule, VicChartModule],
  })
  class SvgAttrTestComponent {
    @Input() chartConfig: ChartConfig;
    @Input() containerWidth = 400;
  }

  describe('ChartComponent SVG attributes by scalingStrategy', () => {
    const baseConfig = new VicChartConfigBuilder()
      .maxWidth(400)
      .maxHeight(300)
      .margin({ top: 20, right: 20, bottom: 20, left: 20 });

    function mountWithStrategy(
      strategy: 'fixed' | 'responsive-width' | 'viewbox'
    ) {
      const config = baseConfig.scalingStrategy(strategy).getConfig();

      cy.mount(SvgAttrTestComponent, {
        componentProperties: { chartConfig: config },
      });
      cy.wait(50);
    }

    it('applies fixed scaling with static width and height', () => {
      mountWithStrategy('fixed');
      cy.get('svg')
        .should('have.attr', 'width', '400')
        .and('have.attr', 'height', '300')
        .and('not.have.attr', 'viewBox');
    });

    it('applies responsive-width scaling with dynamic width and aspect-ratio-derived height', () => {
      mountWithStrategy('responsive-width');
      cy.get('svg').should('not.have.attr', 'viewBox');
      cy.get('svg')
        .invoke('attr', 'width')
        .should('not.be.null')
        .then(Number)
        .should('be.lte', 400);
      cy.get('svg')
        .invoke('attr', 'height')
        .should('not.be.null')
        .then(Number)
        .should('be.gt', 0);
    });

    it('applies viewbox scaling with no width/height but a viewBox attribute', () => {
      mountWithStrategy('viewbox');
      cy.get('svg')
        .should('have.attr', 'viewBox', '0 0 400 300')
        .and('not.have.attr', 'width');
      cy.get('svg')
        .invoke('attr', 'height')
        .should('be.oneOf', [null, undefined]);
      cy.get('svg').should('have.class', 'vic-chart-viewbox');
    });

    it('respects user-supplied aspectRatio override in responsive-width mode', () => {
      const config = baseConfig
        .scalingStrategy('responsive-width')
        .aspectRatio(2)
        .getConfig();

      cy.mount(SvgAttrTestComponent, {
        componentProperties: { chartConfig: config },
      });

      cy.wait(50);
      cy.get('svg')
        .invoke('attr', 'width')
        .should('not.be.null')
        .then(Number)
        .then((width) => {
          cy.get('svg')
            .invoke('attr', 'height')
            .should('not.be.null')
            .then(Number)
            .should('be.closeTo', width / 2, 1);
        });
    });

    it('updates height when user provides a new config', () => {
      const initialConfig = baseConfig.scalingStrategy('fixed').getConfig();

      cy.mount(SvgAttrTestComponent, {
        componentProperties: { chartConfig: initialConfig },
      }).then(({ component, fixture }) => {
        cy.wait(50);

        const updatedConfig = new VicChartConfigBuilder()
          .maxWidth(400)
          .maxHeight(200)
          .scalingStrategy('fixed')
          .getConfig();

        component.chartConfig = updatedConfig;
        fixture.detectChanges();
      });

      cy.wait(100);
      cy.get('svg').should('have.attr', 'height', '200');
    });
  });

  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-scaling-strategy-test',
    template: `
      <div
        [style.width.px]="containerWidth"
        [style.height.px]="containerHeight"
        class="test-wrapper"
      >
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
            <svg:g vic-primary-marks-dots [config]="dotsConfig"></svg:g>
          </ng-container>
        </vic-xy-chart>
      </div>
    `,
    imports: [CommonModule, VicChartModule, VicDotsModule, VicXyAxisModule],
  })
  class ScalingStrategyTestComponent {
    @Input() chartConfig: ChartConfig;
    @Input() dotsConfig: DotsConfig<CountryFactsDatum>;
    @Input() yQuantitativeAxisConfig: VicYQuantitativeAxisConfig<number>;
    @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
    @Input() containerWidth = 400;
    @Input() containerHeight = null;
  }

  describe('ChartComponent scaling strategies', () => {
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const baseConfig = new VicChartConfigBuilder()
      .maxWidth(400)
      .maxHeight(300)
      .margin(margin);

    function mountWithStrategy(
      strategy: ChartConfig['scalingStrategy'],
      containerWidth = 400,
      fixedHeight = false,
      containerHeight = null
    ) {
      const config = baseConfig
        .scalingStrategy(strategy)
        .fixedHeight(fixedHeight)
        .getConfig();
      const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
        .ticks((ticks) => ticks.format('.0f').count(5))
        .getConfig();
      const yAxisConfig =
        new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
      const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
        .data(countryFactsData)
        .xNumeric((x) => x.valueAccessor((d) => d.population))
        .yNumeric((y) => y.valueAccessor((d) => d.gdpPerCapita))
        .radiusNumeric((r) =>
          r.valueAccessor((d) => d.popGrowth).range([4, 10])
        )
        .class((d) => d.country)
        .getConfig();

      cy.mount(ScalingStrategyTestComponent, {
        componentProperties: {
          chartConfig: config,
          xQuantitativeAxisConfig: xAxisConfig,
          yQuantitativeAxisConfig: yAxisConfig,
          dotsConfig,
          containerWidth,
          containerHeight,
        },
      });
    }

    it('applies fixed scaling with static width and height', () => {
      mountWithStrategy('fixed');
      cy.get('svg')
        .should('have.attr', 'width', '400')
        .and('have.attr', 'height', '300')
        .and('not.have.attr', 'viewBox');
    });

    it('applies responsive-width scaling with fixedHeight and updates mark positions when container resizes', () => {
      mountWithStrategy('responsive-width', 300, true);

      getDotTransform().then((originalPosition) => {
        // remount with wider container
        mountWithStrategy('responsive-width', 450, true);
        cy.wait(100);

        getDotTransform().should((newPosition) => {
          expect(newPosition.x).to.be.greaterThan(originalPosition.x);
          expect(newPosition.y).to.closeTo(originalPosition.y, 1);
        });

        // remount with narrower container
        mountWithStrategy('responsive-width', 200, true);
        cy.wait(100);

        getDotTransform().should((newPosition) => {
          expect(newPosition.x).to.be.lessThan(originalPosition.x);
          expect(newPosition.y).to.closeTo(originalPosition.y, 1);
        });
      });
    });

    it('applies responsive-width scaling without fixedHeight and updates mark positions when container resizes', () => {
      mountWithStrategy('responsive-width', 300);

      getDotTransform().then((originalPosition) => {
        // remount with wider container
        mountWithStrategy('responsive-width', 450);
        cy.wait(100);

        getDotTransform().should((newPosition) => {
          expect(newPosition.x).to.be.greaterThan(originalPosition.x);
          expect(newPosition.y).to.be.greaterThan(originalPosition.y);
        });

        // remount with narrower container
        mountWithStrategy('responsive-width', 200);
        cy.wait(100);

        getDotTransform().should((newPosition) => {
          expect(newPosition.x).to.be.lessThan(originalPosition.x);
          expect(newPosition.y).to.be.lessThan(originalPosition.y);
        });
      });
    });
  });

  it('applies responsive-width scaling without fixedHeight and updates mark positions when container resizes', () => {
    mountWithStrategy('responsive-width', 300);

    getDotTransform().then((originalPosition) => {
      // remount with wider container
      mountWithStrategy('responsive-width', 450);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.greaterThan(originalPosition.x);
        expect(newPosition.y).to.be.greaterThan(originalPosition.y);
      });

      // remount with narrower container
      mountWithStrategy('responsive-width', 200);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.lessThan(originalPosition.x);
        expect(newPosition.y).to.be.lessThan(originalPosition.y);
      });
    });
  });
});
