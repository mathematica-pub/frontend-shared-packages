/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {
  BarsComponent,
  BarsConfig,
  ChartConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
} from '@hsi/viz-components';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { expectDomain } from './domain-test-utility';
import { PercentOverDomainPadding } from './percent-over/percent-over';
import { PixelDomainPadding } from './pixel/pixel';
import { RoundUpToIntervalDomainPadding } from './round-to-interval/round-to-interval';
import { RoundUpToSigFigDomainPadding } from './round-to-sig-fig/round-to-sig-fig';

type Datum = { state: string; value: number };
@Component({
  selector: 'vic-test-bars-quantitative-domain-padding',
  template: `
    <p *ngFor="let item of domain$ | async" class="domain-value">{{ item }}</p>
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
  imports: [VicChartModule, VicBarsModule, VicXyAxisModule, CommonModule],
})
class TestXQuantitativeDomainComponent implements AfterViewInit {
  @Input() barsConfig: BarsConfig<Datum, string>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  @ViewChild(BarsComponent) barsComponent: BarsComponent<Datum, string>;
  domain = new BehaviorSubject<[number, number]>([undefined, undefined]);
  domain$ = this.domain.asObservable();
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .height(800)
    .margin({ top: 20, right: 20, bottom: 20, left: 20 })
    .resize({ height: false, useViewbox: false })
    .getConfig();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.domain.next(
        this.barsComponent.scales.x.domain() as [number, number]
      );
    });
  }
}

function getDomainValues(): Promise<[number, number]> {
  return new Promise((resolve) => {
    cy.get('.domain-value').then((els) => {
      resolve([+els[0].textContent, +els[1].textContent]);
    });
  });
}

function getD3DomainRect(): Promise<DOMRect> {
  return new Promise((resolve) => {
    cy.get('.vic-axis-x-quantitative .domain').then((domain) => {
      const domainRect = (domain[0] as unknown as SVGPathElement).getBBox();
      resolve(domainRect);
    });
  });
}

function distanceBetweenBarAndDomainMaxIs(
  barIndex: number,
  numPixels: number
): void {
  getBarWidthByIndex(barIndex).then((barWidth) => {
    getD3DomainRect().then((domainRect) => {
      const domainRightEdge = domainRect.width;
      expect(+barWidth + numPixels).to.be.closeTo(domainRightEdge, 1);
    });
  });
}

function getBarWidthByIndex(index: number): Cypress.Chainable {
  return cy.get('.vic-bars-bar').eq(index).invoke('attr', 'width');
}

describe('it correctly sets quantitative domain - all values are positive, 0 is explicitly included in domain', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data([
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 30.3 },
      ])
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.state))
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    axisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
  });
  describe('X domain is the default: 0, max value', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(30.3).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 1,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(40).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 2,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue whose second significant digit is rounded up by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToIntervalDomainPadding({
          interval: () => 5,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue rounded up to the nearest 10', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(35).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 20;
      (barsConfig.quantitative as any).domainPadding =
        new PercentOverDomainPadding({
          percentOver: 0.05,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and  a domain[1] of maxValue * (1 + percent over)', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(21).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    const numPixels = 50;
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding = new PixelDomainPadding({
        numPixels,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has the correct padding', () => {
      distanceBetweenBarAndDomainMaxIs(2, numPixels);
    });
  });
});

describe('it correctly sets quantitative domain - all values are positive, 0 is NOT in domain', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data([
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 30.3 },
      ])
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.state))
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    axisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
  });
  describe('X domain is default/not padded', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(1.1).maxToBe(30.3).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 1,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(1.1).maxToBe(40).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 2,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a domain of minValue, maxValue whose second significant digit is rounded up by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(1.1).maxToBe(31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToIntervalDomainPadding({
          interval: () => 5,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue rounded up to the nearest 10', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(1.1).maxToBe(35).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 20;
      (barsConfig.quantitative as any).domainPadding =
        new PercentOverDomainPadding({
          percentOver: 0.05,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue * (1 + percent over)', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(1.1).maxToBe(21).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    const numPixels = 50;
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding = new PixelDomainPadding({
        numPixels,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has the correct padding', () => {
      distanceBetweenBarAndDomainMaxIs(2, numPixels);
    });
  });
});

describe('it correctly sets quantitative domain - all values are negative, 0 is explicitly included in domain', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data([
        { state: 'Alabama', value: -1.1 },
        { state: 'Alaska', value: -2.2 },
        { state: 'Arizona', value: -30.3 },
      ])
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.state))
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    axisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
  });
  describe('X domain is the default: min value, 0', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a a domain[1] of 0', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-30.3).maxToBe(0).validate()
      );
    });
  });
  describe('X domain turns off including 0', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).includeZeroInDomain = false;
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-30.3).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 1,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] minValue whose first significant digit is rounded out by one and a a domain[1] of 0', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-40).maxToBe(0).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 2,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain of minValue whose second significant digit is rounded out by one and a domain[1] of 0', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-31).maxToBe(0).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToIntervalDomainPadding({
          interval: () => 5,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain of minValue rounded out to the nearest 5 and a domain[1] of 0', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-35).maxToBe(0).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = -20;
      (barsConfig.quantitative as any).domainPadding =
        new PercentOverDomainPadding({
          percentOver: 0.05,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue * (1 + percent over) and a domain[1] of 0', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-21).maxToBe(0).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    const numPixels = 40;
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding = new PixelDomainPadding({
        numPixels,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has the correct padding', () => {
      distanceBetweenBarAndDomainMaxIs(2, numPixels);
    });
  });
});

describe('it correctly sets quantitative domain - all values are negative, 0 is NOT in domain', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data([
        { state: 'Alabama', value: -1.1 },
        { state: 'Alaska', value: -2.2 },
        { state: 'Arizona', value: -30.3 },
      ])
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.state))
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    axisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
  });
  describe('X domain turns off including 0', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-30.3).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 1,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue whose first significant digit is rounded out by one sig digit and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-40).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 2,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue whose second significant digit is rounded up by one and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-31).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToIntervalDomainPadding({ interval: () => 5 });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain of minValue rounded out to the nearest 5 and a domain[1] maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-35).maxToBe(-1.1).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = -20;
      (barsConfig.quantitative as any).domainPadding =
        new PercentOverDomainPadding({
          percentOver: 0.05,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue * (1 + percent over) and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-21).maxToBe(-1.1).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    const numPixels = 40;
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding = new PixelDomainPadding({
        numPixels: numPixels,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has the correct padding', () => {
      distanceBetweenBarAndDomainMaxIs(2, numPixels);
    });
  });
});

describe('it correctly sets quantitative domain - values are positive and negative', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data([
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 30.3 },
        { state: 'Arkansas', value: -2.2 },
        { state: 'California', value: -60.6 },
      ])
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.state))
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    axisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
  });
  describe('X domain is the default: min value, 0', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a domain[1] maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-60.6).maxToBe(30.3).validate()
      );
    });
  });
  describe('X domain turns off including 0', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).includeZeroInDomain = false;
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-60.6).maxToBe(30.3).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 1,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue whose first significant digit is rounded out by one and a domain[1] of maxValue whose first significant digit is rounded out by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-70).maxToBe(40).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 2,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] whose minValue whose second significant digit is rounded out by one and a domain[1] whose maxValue whose second significant digit is rounded out by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-61).maxToBe(31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToIntervalDomainPadding({ interval: () => 5 });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue rounded out to the nearest 5 and a domain[1] of maxValue rounded out to the nearest 5', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-65).maxToBe(35).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 20;
      barsConfig.data.find((d) => d.state === 'California').value = -60;
      (barsConfig.quantitative as any).domainPadding =
        new PercentOverDomainPadding({
          percentOver: 0.05,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of minValue * (1 + percent over) and a domain[1] of maxValue * (1 + percent over)', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(-63).maxToBe(21).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    const numPixels = 60;
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding = new PixelDomainPadding({
        numPixels: numPixels,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has the correct padding', () => {
      getBarWidthByIndex(2).then((positiveBarWidth) => {
        getBarWidthByIndex(4).then((negativeBarWidth) => {
          getD3DomainRect().then((domainRect) => {
            expect(
              +positiveBarWidth + +negativeBarWidth + 2 * numPixels
            ).to.be.closeTo(domainRect.width, 1);
          });
        });
      });
    });
  });
});

describe('it correctly sets quantitative domain - all values are positive and less than one, 0 is explicitly included in domain', () => {
  let barsConfig: BarsConfig<Datum, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<Datum, string>()
      .data([
        { state: 'Alabama', value: 0.01 },
        { state: 'Alaska', value: 0.22 },
        { state: 'Arizona', value: 0.303 },
      ])
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.state))
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    axisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
  });
  describe('X domain is the default: 0, max value', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(0.303).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 1,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(0.4).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToSigFigDomainPadding({
          sigFigures: () => 2,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue whose second significant digit is rounded up by one', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(0.31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding =
        new RoundUpToIntervalDomainPadding({ interval: () => 0.2 });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue rounded up to the nearest 0.2', () => {
      getDomainValues().then((values) =>
        expectDomain(values).minToBe(0).maxToBe(0.4).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 0.4;
      (barsConfig.quantitative as any).domainPadding =
        new PercentOverDomainPadding({
          percentOver: 0.05,
        });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue * (1 + percent over)', () => {
      getDomainValues().then((values) =>
        expectDomain(values)
          .minToBe(0)
          .maxToBe(0.42, { assert: 'isCloseTo' })
          .validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    const numPixels = 30;
    beforeEach(() => {
      (barsConfig.quantitative as any).domainPadding = new PixelDomainPadding({
        numPixels: numPixels,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
    });
    it('has the correct padding', () => {
      distanceBetweenBarAndDomainMaxIs(2, numPixels);
    });
  });
});
