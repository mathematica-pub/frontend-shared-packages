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

@Component({
  selector: 'app-test-bars-quantitative-domain-padding',
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
    barsConfig.data = [];
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
    it('has a domain[0] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(0);
      });
    });
    it('has a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(30.3);
      });
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
    it('has a domain[0] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(0);
      });
    });
    it('has a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(40);
      });
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    let component;
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      component = cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(0);
      });
    });
    it('has a domain[1] of maxValue whose second significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(31);
      });
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
    it('has a domain[0] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(0);
      });
    });
    it('has a domain[1] of maxValue rounded up to the nearest 10', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(35);
      });
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
    it('has a domain[0] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(0);
      });
    });
    it('has a domain[1] of maxValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(21);
      });
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
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(0);
      });
    });
    it('has a domain[1]', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.be.above(31);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(1.1);
      });
    });
    it('has a domain[1] of minValue, maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(30.3);
      });
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
    it('has a domain[0] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(1.1);
      });
    });
    it('has a domain[1] maxValue whose first significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(40);
      });
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    let component;
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      component = cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(1.1);
      });
    });
    it('has a domain of minValue, maxValue whose second significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(31);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(1.1);
      });
    });
    it('has a domain[1] or maxValue rounded up to the nearest 10', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(35);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(1.1);
      });
    });
    it('has a domain[1] of maxValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(21);
      });
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
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(1.1);
      });
    });
    it('has a domain[1] of maxValue + pixels', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.be.above(31);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-30.3);
      });
    });
    it('has a domain[1] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(0);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-30.3);
      });
    });
    it('has a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(-1.1);
      });
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
    it('has a domain[0] minValue whose first significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-40);
      });
    });
    it('has a domain[1] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(0);
      });
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    let component;
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      component = cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain of minValue whose second significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-31);
      });
    });
    it('has a domain[1] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(0);
      });
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
    it('has a domain of minValue rounded out to the nearest 5', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-35);
      });
    });
    it('has a domain[1] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(0);
      });
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
    it('has a domain[0] of minValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-21);
      });
    });
    it('has a domain[1] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(0);
      });
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
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.be.below(-31);
      });
    });
    it('has a domain[1] of 0', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(0);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-30.3);
      });
    });
    it('has a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(-1.1);
      });
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
    it('has a domain[0] of minValue whose first significant digit is rounded out by one sig digit', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-40);
      });
    });
    it('has a domain[1] of maxValue ', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(-1.1);
      });
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    let component;
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      component = cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain of minValue whose second significant digit is rounded up by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-31);
      });
    });
    it('has a domain of maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(-1.1);
      });
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
    it('has a domain of minValue rounded out to the nearest 5', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-35);
      });
    });
    it('has a domain[1] maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(-1.1);
      });
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
    it('has a domain[0] of minValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-21);
      });
    });
    it('has a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(-1.1);
      });
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
    it('has a domain[0] of minValue - pixels', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.be.below(-31);
      });
    });
    it('has a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(-1.1);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-60.6);
      });
    });
    it('has a domain[1] maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(30.3);
      });
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
    it('has a domain[0] of minValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-60.6);
        expect(+values[1].textContent).to.equal(30.3);
      });
    });
    it('has a domain[1] of maxValue', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-60.6);
        expect(+values[1].textContent).to.equal(30.3);
      });
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
    it('has a domain[0] of minValue whose first significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-70);
        expect(+values[1].textContent).to.equal(40);
      });
    });
    it('has a domain[1] of maxValue whose first significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-70);
        expect(+values[1].textContent).to.equal(40);
      });
    });
  });
  describe('roundUp domain padding - 2 sig digits', () => {
    let component;
    beforeEach(() => {
      barsConfig.quantitative.domainPadding = new VicRoundUpDomainPaddingConfig(
        { sigDigits: () => 2 }
      );
      component = cy.mount(TestXQuantitativeDomainComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a domain[0] whose minValue whose second significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-61);
      });
    });
    it('has a domain[1] whose maxValue whose second significant digit is rounded out by one', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(31);
      });
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
    it('has a domain[0] of minValue rounded out to the nearest 5', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-65);
      });
    });
    it('has a domain[1] of maxValue rounded out to the nearest 5', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(35);
      });
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
    it('has a domain[0] of minValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.equal(-63);
      });
    });
    it('has a domain[1] of maxValue * (1 + percent over)', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.equal(21);
      });
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
    it('has a domain[0] of minValue - pixels', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[0].textContent).to.be.below(-61);
      });
    });
    it('has a domain[1], maxValue + pixels', () => {
      cy.get('.domain-value').then((values) => {
        expect(+values[1].textContent).to.be.above(31);
      });
    });
  });
});
