import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { cy } from 'local-cypress';
import {
  BarsComponent,
  VicAxisConfig,
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicBarsModule,
  VicChartModule,
  VicHorizontalBarsDimensionsConfig,
  VicPercentOverDomainPaddingConfig,
  VicPixelDomainPaddingConfig,
  VicRoundUpDomainPaddingConfig,
  VicRoundUpToIntervalDomainPaddingConfig,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject } from 'rxjs';
import { expectDomain } from './testing/expect-domain';

@Component({
  selector: 'vic-test-bars-quantitative-domain-padding',
  template: `
    <p *ngFor="let item of domain$ | async" class="domain-value">{{ item }}</p>
    <vic-xy-chart
      [margin]="margin"
      [height]="800"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
          side="top"
        ></svg:g>
        <svg:g vic-data-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestXQuantitativeDomainComponent implements AfterViewInit {
  @Input() barsConfig: VicBarsConfig<{ state: string; value: number }>;
  @Input() xQuantitativeAxisConfig: VicAxisConfig;
  @ViewChild(BarsComponent) barsComponent: BarsComponent<{
    state: string;
    value: number;
  }>;
  margin = { top: 20, right: 20, bottom: 20, left: 20 };
  domain = new BehaviorSubject<[number, number]>([undefined, undefined]);
  domain$ = this.domain.asObservable();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.domain.next(
        this.barsComponent.scales.x.domain() as [number, number]
      );
    });
  }
}

describe('it correctly sets quantitative domain - all values are positive, 0 is explicitly included in domain', () => {
  let barsConfig: VicBarsConfig<{ state: string; value: number }>;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeDomainComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.data = [
      { state: 'Alabama', value: 1.1 },
      { state: 'Alaska', value: 2.2 },
      { state: 'Arizona', value: 30.3 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0f';
  });
  describe('X domain is the default: 0, max value', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(30.3).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      const roundUpDomainPadding = new VicRoundUpDomainPaddingConfig();
      roundUpDomainPadding.sigDigits = () => 1;
      barsConfig.quantitative.domainPadding = roundUpDomainPadding;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(300);
    });
    it('has a domain[0] of 0 and a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(40).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue whose second significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding =
        new VicRoundUpToIntervalDomainPaddingConfig({ interval: () => 5 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue rounded up to the nearest 10', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(35).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 20;
      barsConfig.quantitative.domainPadding =
        new VicPercentOverDomainPaddingConfig({ percentOver: 0.05 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and  a domain[1] of maxValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(21).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig({
        numPixels: 50,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(500);
    });
    it('has a domain[0] of 0', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els)
          .minToBe(0)
          .maxToBe(31, { assert: 'isAbove' })
          .validate()
      );
    });
  });
});

describe('it correctly sets quantitative domain - all values are positive, 0 is NOT in domain', () => {
  let barsConfig: VicBarsConfig<{ state: string; value: number }>;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeDomainComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.quantitative.domainIncludesZero = false;
    barsConfig.data = [
      { state: 'Alabama', value: 1.1 },
      { state: 'Alaska', value: 2.2 },
      { state: 'Arizona', value: 30.3 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0f';
  });
  describe('X domain is default/not padded', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainIncludesZero = false;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(1.1).maxToBe(30.3).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      const roundUpDomainPadding = new VicRoundUpDomainPaddingConfig();
      roundUpDomainPadding.sigDigits = () => 1;
      barsConfig.quantitative.domainPadding = roundUpDomainPadding;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(300);
    });
    it('has a domain[0] of 0 and a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(1.1).maxToBe(40).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a domain of minValue, maxValue whose second significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(1.1).maxToBe(31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding =
        new VicRoundUpToIntervalDomainPaddingConfig({ interval: () => 5 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue rounded up to the nearest 10', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(1.1).maxToBe(35).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 20;
      barsConfig.quantitative.domainPadding =
        new VicPercentOverDomainPaddingConfig({ percentOver: 0.05 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(1.1).maxToBe(21).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig({
        numPixels: 50,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(500);
    });
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els)
          .minToBe(1.1)
          .maxToBe(31, { assert: 'isAbove' })
          .validate()
      );
    });
  });
});

describe('it correctly sets quantitative domain - all values are negative, 0 is explicitly included in domain', () => {
  let barsConfig: VicBarsConfig<{ state: string; value: number }>;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeDomainComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.data = [
      { state: 'Alabama', value: -1.1 },
      { state: 'Alaska', value: -2.2 },
      { state: 'Arizona', value: -30.3 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0f';
  });
  describe('X domain is the default: min value, 0', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a a domain[1] of 0', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-30.3).maxToBe(0).validate()
      );
    });
  });
  describe('X domain turns off including 0', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainIncludesZero = false;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-30.3).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      const roundUpDomainPadding = new VicRoundUpDomainPaddingConfig();
      roundUpDomainPadding.sigDigits = () => 1;
      barsConfig.quantitative.domainPadding = roundUpDomainPadding;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(300);
    });
    it('has a domain[0] minValue whose first significant digit is rounded out by one and a a domain[1] of 0', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-40).maxToBe(0).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain of minValue whose second significant digit is rounded out by one and a domain[1] of 0', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-31).maxToBe(0).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding =
        new VicRoundUpToIntervalDomainPaddingConfig({ interval: () => 5 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain of minValue rounded out to the nearest 5 and a domain[1] of 0', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-35).maxToBe(0).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = -20;
      barsConfig.quantitative.domainPadding =
        new VicPercentOverDomainPaddingConfig({ percentOver: 0.05 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue * (1 + percent over) and a domain[1] of 0', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-21).maxToBe(0).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig({
        numPixels: 50,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(500);
    });
    it('has a domain[0] of less than min and a domain[1] of 0', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els)
          .minToBe(-31, { assert: 'isBelow' })
          .maxToBe(0)
          .validate()
      );
    });
  });
});

describe('it correctly sets quantitative domain - all values are negative, 0 is NOT in domain', () => {
  let barsConfig: VicBarsConfig<{ state: string; value: number }>;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeDomainComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.quantitative.domainIncludesZero = false;
    barsConfig.data = [
      { state: 'Alabama', value: -1.1 },
      { state: 'Alaska', value: -2.2 },
      { state: 'Arizona', value: -30.3 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0f';
  });
  describe('X domain turns off including 0', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-30.3).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      const roundUpDomainPadding = new VicRoundUpDomainPaddingConfig();
      roundUpDomainPadding.sigDigits = () => 1;
      barsConfig.quantitative.domainPadding = roundUpDomainPadding;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(300);
    });
    it('has a domain[0] of minValue whose first significant digit is rounded out by one sig digit and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-40).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue whose second significant digit is rounded up by one and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-31).maxToBe(-1.1).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding =
        new VicRoundUpToIntervalDomainPaddingConfig({ interval: () => 5 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain of minValue rounded out to the nearest 5 and a domain[1] maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-35).maxToBe(-1.1).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = -20;
      barsConfig.quantitative.domainPadding =
        new VicPercentOverDomainPaddingConfig({ percentOver: 0.05 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue * (1 + percent over) and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-21).maxToBe(-1.1).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig({
        numPixels: 50,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(500);
    });
    it('has a domain[0] of minValue - pixels and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els)
          .minToBe(-31, { assert: 'isBelow' })
          .maxToBe(-1.1)
          .validate()
      );
    });
  });
});

describe('it correctly sets quantitative domain - values are positive and negative', () => {
  let barsConfig: VicBarsConfig<{ state: string; value: number }>;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeDomainComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.data = [
      { state: 'Alabama', value: 1.1 },
      { state: 'Alaska', value: 2.2 },
      { state: 'Arizona', value: 30.3 },
      { state: 'Arkansas', value: -2.2 },
      { state: 'California', value: -60.6 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0f';
  });
  describe('X domain is the default: min value, 0', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a domain[1] maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-60.6).maxToBe(30.3).validate()
      );
    });
  });
  describe('X domain turns off including 0', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainIncludesZero = false;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-60.6).maxToBe(30.3).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      const roundUpDomainPadding = new VicRoundUpDomainPaddingConfig();
      roundUpDomainPadding.sigDigits = () => 1;
      barsConfig.quantitative.domainPadding = roundUpDomainPadding;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(300);
    });
    it('has a domain[0] of minValue whose first significant digit is rounded out by one and a domain[1] of maxValue whose first significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-70).maxToBe(40).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] whose minValue whose second significant digit is rounded out by one and a domain[1] whose maxValue whose second significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-61).maxToBe(31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding =
        new VicRoundUpToIntervalDomainPaddingConfig({ interval: () => 5 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue rounded out to the nearest 5 and a domain[1] of maxValue rounded out to the nearest 5', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-65).maxToBe(35).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 20;
      barsConfig.data.find((d) => d.state === 'California').value = -60;
      barsConfig.quantitative.domainPadding =
        new VicPercentOverDomainPaddingConfig({ percentOver: 0.05 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue * (1 + percent over) and a domain[1] of maxValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(-63).maxToBe(21).validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig({
        numPixels: 50,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(500);
    });
    it('has a domain[0] of minValue - pixels and a domain[1], maxValue + pixels', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els)
          .minToBe(-61, { assert: 'isBelow' })
          .maxToBe(31, { assert: 'isAbove' })
          .validate()
      );
    });
  });
});

describe('it correctly sets quantitative domain - all values are positive and less than one, 0 is explicitly included in domain', () => {
  let barsConfig: VicBarsConfig<{ state: string; value: number }>;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeDomainComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = new VicBarsConfig();
    barsConfig.data = [];
    barsConfig.dimensions = new VicHorizontalBarsDimensionsConfig();
    barsConfig.ordinal.valueAccessor = (d) => d.state;
    barsConfig.quantitative.valueAccessor = (d) => d.value;
    barsConfig.data = [
      { state: 'Alabama', value: 0.01 },
      { state: 'Alaska', value: 0.22 },
      { state: 'Arizona', value: 0.303 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0f';
  });
  describe('X domain is the default: 0, max value', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(0.303).validate()
      );
    });
  });
  describe('roundUp domain padding - 1 sig digit', () => {
    beforeEach(() => {
      const roundUpDomainPadding = new VicRoundUpDomainPaddingConfig();
      roundUpDomainPadding.sigDigits = () => 1;
      barsConfig.quantitative.domainPadding = roundUpDomainPadding;
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(300);
    });
    it('has a domain[0] of 0 and a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(0.4).validate()
      );
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue whose second significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(0.31).validate()
      );
    });
  });
  describe('roundUpToInterval domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding =
        new VicRoundUpToIntervalDomainPaddingConfig({ interval: () => 0.2 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue rounded up to the nearest 0.2', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els).minToBe(0).maxToBe(0.4).validate()
      );
    });
  });
  describe('percent over domain padding', () => {
    beforeEach(() => {
      barsConfig.data.find((d) => d.state === 'Arizona').value = 0.4;
      barsConfig.quantitative.domainPadding =
        new VicPercentOverDomainPaddingConfig({ percentOver: 0.05 });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0 and a domain[1] of maxValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els)
          .minToBe(0)
          .maxToBe(0.42, { assert: 'isCloseTo' })
          .validate()
      );
    });
  });
  describe('pixel domain padding', () => {
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicPixelDomainPaddingConfig({
        numPixels: 50,
      });
      cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(500);
    });
    it('has a domain[0] of 0 and a domain[1] above the max value', () => {
      cy.get('.domain-value').then((els) =>
        expectDomain(els)
          .minToBe(0)
          .maxToBe(0.303, { assert: 'isAbove' })
          .validate()
      );
    });
  });
});
