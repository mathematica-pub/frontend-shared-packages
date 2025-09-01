import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  CHART_SIZE,
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

describe.only('ChartComponent applies correct SVG attributes/styles by scalingStrategy on initial render', () => {
  const testWidth = 400;
  const testHeight = 300;
  const baseConfig = new VicChartConfigBuilder()
    .maxWidth(testWidth)
    .margin({ top: 20, right: 20, bottom: 20, left: 20 });

  function mountWithStrategy(config: ChartConfig = baseConfig.getConfig()) {
    cy.mount(SvgAttrTestComponent, {
      componentProperties: { chartConfig: config },
    });
    cy.wait(50);
  }

  it('applies fixed scaling with static width and aspect-ratio derived height', () => {
    mountWithStrategy(baseConfig.scalingStrategy('fixed').getConfig());
    cy.get('svg')
      .should('have.css', 'width', `${testWidth}px`)
      .and('have.css', 'height', `${testWidth / CHART_SIZE.aspectRatio}px`)
      .and('not.have.attr', 'viewBox');
  });

  it('applies fixed scaling with static width and user-speced height that overrides aspect ratio', () => {
    mountWithStrategy(
      baseConfig.scalingStrategy('fixed').maxHeight(testHeight).getConfig()
    );
    cy.get('svg')
      .should('have.css', 'width', `${testWidth}px`)
      .and('have.css', 'height', `${testHeight}px`)
      .and('not.have.attr', 'viewBox');
  });

  it('applies responsive-width scaling with dynamic width and aspect-ratio-derived height', () => {
    mountWithStrategy(
      baseConfig.scalingStrategy('responsive-width').maxHeight(null).getConfig()
    );
    cy.get('svg').should('not.have.attr', 'viewBox');
    cy.get('svg')
      .invoke('css', 'width')
      .then((w) => {
        const wNum = parseFloat(String(w));
        expect(Number.isFinite(wNum) ? wNum : 0).to.be.lte(testWidth);

        cy.get('svg')
          .invoke('css', 'height')
          .then((h) => {
            const hNum = parseFloat(String(h));
            expect(Number.isFinite(hNum) ? hNum : 0).to.be.closeTo(
              wNum / CHART_SIZE.aspectRatio,
              0.1
            );
          });
      });
  });

  it('applies responsive-width scaling with dynamic width and max-height-derived height', () => {
    const config = baseConfig
      .scalingStrategy('responsive-width')
      .maxHeight(testHeight)
      .aspectRatio(2) // should ignore this
      .getConfig();

    mountWithStrategy(config);

    cy.wait(50);
    cy.get('svg')
      .invoke('css', 'width')
      .then((w) => {
        const n = parseFloat(String(w));
        const width = Number.isFinite(n) ? n : 0;
        cy.get('svg')
          .invoke('css', 'height')
          .then((h) => {
            const m = parseFloat(String(h));
            const height = Number.isFinite(m) ? m : 0;
            expect(height).to.be.closeTo(width / (testWidth / testHeight), 0.1);
          });
      });
  });

  it('applies viewbox scaling with a viewBox attribute', () => {
    mountWithStrategy(baseConfig.scalingStrategy('viewbox').getConfig());
    const vbHeight = CHART_SIZE.viewBoxWidth / (testWidth / testHeight);
    cy.get('svg')
      .should(
        'have.attr',
        'viewBox',
        `0 0 ${CHART_SIZE.viewBoxWidth} ${vbHeight}`
      )
      .and('have.class', 'viewbox');
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

describe('ChartComponent correctly changes size of chart with scaling strategies', () => {
  const testWidth = 800;
  const testHeight = 600;
  const testContainerWidth = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const baseConfig = new VicChartConfigBuilder().margin(margin).minWidth(100);

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

  function mountWithStrategy(
    config: ChartConfig,
    containerWidth,
    containerHeight
  ) {
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
      .datumClass((d) => d.country)
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

  it('applies fixed scaling with static width and height and does not scale down', () => {
    const config = baseConfig
      .scalingStrategy('fixed')
      .maxWidth(testWidth)
      .maxHeight(testHeight)
      .getConfig();
    mountWithStrategy(config, testContainerWidth, null);
    cy.get('svg')
      .should('have.css', 'width', `${testWidth}px`)
      .and('have.css', 'height', `${testHeight}px`)
      .and('not.have.attr', 'viewBox');
  });

  it('updates height when user provides a new height', () => {
    const config = baseConfig
      .scalingStrategy('fixed')
      .maxWidth(testWidth)
      .maxHeight(testHeight)
      .getConfig();
    mountWithStrategy(config, testContainerWidth, null);
    cy.wait(100);

    const newConfig = baseConfig
      .scalingStrategy('fixed')
      .maxWidth(testWidth)
      .maxHeight(testHeight + 100)
      .getConfig();
    mountWithStrategy(newConfig, testContainerWidth, null);
    cy.get('svg')
      .should('have.css', 'width', `${testWidth}px`)
      .and('have.css', 'height', `${testHeight + 100}px`)
      .and('not.have.attr', 'viewBox');
  });

  it('applies responsive-width scaling with fixedHeight and updates mark positions when container resizes', () => {
    const config = baseConfig
      .scalingStrategy('responsive-width')
      .maxWidth(testWidth)
      .fixedHeight(true)
      .aspectRatio(2)
      .getConfig();
    mountWithStrategy(config, testContainerWidth, null);

    getDotTransform().then((originalPosition) => {
      // remount with wider container
      mountWithStrategy(config, testContainerWidth + 100, null);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.greaterThan(originalPosition.x);
        expect(newPosition.y).to.closeTo(originalPosition.y, 1);
      });

      // remount with narrower container
      mountWithStrategy(config, testContainerWidth - 100, true);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.lessThan(originalPosition.x);
        expect(newPosition.y).to.closeTo(originalPosition.y, 1);
      });
    });
  });

  it('applies responsive-width scaling without fixedHeight and updates mark positions when container resizes', () => {
    const config = baseConfig
      .scalingStrategy('responsive-width')
      .maxWidth(testWidth)
      .fixedHeight(false)
      .aspectRatio(2)
      .getConfig();
    mountWithStrategy(config, testContainerWidth, null);

    getDotTransform().then((originalPosition) => {
      // remount with wider container
      mountWithStrategy(config, testContainerWidth + 100, null);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.greaterThan(originalPosition.x);
        expect(newPosition.y).to.greaterThan(originalPosition.y);
      });

      // remount with narrower container
      mountWithStrategy(config, testContainerWidth - 100, true);
      cy.wait(100);

      getDotTransform().should((newPosition) => {
        expect(newPosition.x).to.be.lessThan(originalPosition.x);
        expect(newPosition.y).to.lessThan(originalPosition.y);
      });
    });
  });
});
