import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ChartConfig,
  VicChartConfigBuilder,
  VicChartModule,
} from '@hsi/viz-components';
import { cy, describe, it } from 'local-cypress';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-scaling-strategy-test',
  template: `
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
  `,
  standalone: true,
  imports: [CommonModule, VicChartModule],
})
class ScalingStrategyTestComponent {
  @Input() chartConfig: ChartConfig;
}

describe('ChartComponent scaling strategies', () => {
  const baseConfig = new VicChartConfigBuilder()
    .width(800)
    .height(600)
    .margin({ top: 20, right: 20, bottom: 20, left: 20 });

  function mountWithStrategy(
    strategy: 'fixed' | 'responsive-width' | 'responsive-both' | 'viewbox'
  ) {
    const config = baseConfig.scalingStrategy(strategy).getConfig();

    cy.mount(ScalingStrategyTestComponent, {
      componentProperties: { chartConfig: config },
    });
  }

  it('applies fixed scaling with static width and height', () => {
    mountWithStrategy('fixed');
    cy.get('svg')
      .should('have.attr', 'width', '800')
      .and('have.attr', 'height', '600')
      .and('not.have.attr', 'viewBox');
  });

  it('applies responsive-width scaling with dynamic width and aspect-ratio-derived height', () => {
    mountWithStrategy('responsive-width');
    cy.get('svg').should('not.have.attr', 'viewBox');
    cy.get('svg').invoke('attr', 'width').then(Number).should('be.lte', 800);
    cy.get('svg').invoke('attr', 'height').then(Number).should('be.gt', 0);
  });

  it('applies responsive-both scaling with dynamic width and height', () => {
    mountWithStrategy('responsive-both');
    cy.get('svg').should('not.have.attr', 'viewBox');
    cy.get('svg').invoke('attr', 'width').then(Number).should('be.gt', 0);
    cy.get('svg').invoke('attr', 'height').then(Number).should('be.gt', 0);
  });

  it('applies viewbox scaling with no width/height but a viewBox attribute', () => {
    mountWithStrategy('viewbox');
    cy.get('svg')
      .should('have.attr', 'viewBox', '0 0 800 600')
      .and('not.have.attr', 'width')
      .and('not.have.attr', 'height');
    cy.get('svg').should('have.class', 'vic-chart-viewbox');
  });
});
