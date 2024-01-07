import { Component, Input } from '@angular/core';
import 'cypress/support/component';
import { extent } from 'd3';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { VicAxisConfig } from 'projects/viz-components/src/lib/axes/axis.config';
import {
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicHorizontalBarsDimensionsConfig,
} from 'projects/viz-components/src/lib/bars/bars.config';
import {
  VicBarsModule,
  VicChartModule,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
} from 'projects/viz-components/src/public-api';

@Component({
  selector: 'app-test-x-quantitative-axis',
  template: `
    <p>hello</p>
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
class TestXQuantitativeAxisComponent {
  @Input() barsConfig: VicBarsConfig;
  @Input() xQuantitativeAxisConfig: VicAxisConfig;
  margin = { top: 20, right: 20, bottom: 20, left: 20 };
}

describe('it correctly sets ticks', () => {
  let barsConfig: VicBarsConfig;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeAxisComponent];
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
  describe('only tickFormat is specified by the user', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has a last tick whose value is less than or equal to the max value', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const lastTick = ticks[ticks.length - 1];
        expect(Number(lastTick.textContent)).toBeLessThanOrEqual(
          barsConfig.data.map((d) => d.value).reduce((a, b) => Math.max(a, b))
        );
      });
    });
  });
  describe('tick values are specified by user', () => {
    beforeEach(() => {
      axisConfig.tickValues = [1, 2, 7, 21];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has the specified tick values', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(axisConfig.tickValues.map(String));
      });
    });
  });
  describe('tick values are specified by user - tick values are outside of data range', () => {
    beforeEach(() => {
      axisConfig.tickValues = [-1, 1, 2, 7, 21, 100];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has the specified tick values, excluding those that are outside of the data range', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['1', '2', '7', '21']);
      });
    });
  });
});

describe('integer formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: VicBarsConfig;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeAxisComponent];
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
    validFormatRegex = /^\d+$/;
  });
  describe('only tickFormat is specified by the user', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are formatted as specified -- case .0f', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not integers', () => {
    beforeEach(() => {
      axisConfig.tickValues = [1.1, 2.2, 7.7, 21.21];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has the specified tick values, rounded to the nearest integer', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['1', '2', '8', '21']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer integer values than numTicks', () => {
    beforeEach(() => {
      axisConfig.numTicks = 10;
      barsConfig.data = [
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 3.3 },
      ];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are formatted as integers', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
    it('has only one tick per integer in the domain / does not have duplicate tick values', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['0', '1', '2', '3']);
      });
    });
  });
  describe('user specifies numTicks and data max is less than 1 (first possible value given formatter)', () => {
    beforeEach(() => {
      axisConfig.numTicks = 10;
      barsConfig.data = [
        { state: 'Alabama', value: 0.1 },
        { state: 'Alaska', value: 0.4 },
        { state: 'Arizona', value: 0.8 },
      ];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are formatted as integers', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
    it('has only one tick and that tick is at zero', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['0']);
      });
    });
  });
});

describe('float formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: VicBarsConfig;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeAxisComponent];
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
    axisConfig.tickFormat = '.1f';
    validFormatRegex = /^(\d|[1-9]\d+)\.\d$/;
  });
  describe('only tickFormat is specified by the user', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are formatted as floats with the correct number of decimal places - case .1f', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not the correct format', () => {
    beforeEach(() => {
      axisConfig.tickValues = [1, 2.27, 7.0, 21.21];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has the specified tick values, rounded to the nearest integer', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['1.0', '2.3', '7.0', '21.2']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer possible formatted values than numTicks', () => {
    let possibleValues: number;
    beforeEach(() => {
      axisConfig.numTicks = 100;
      barsConfig.data = [
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 3.3 },
      ];
      const numDecimalPlaces = 1;
      possibleValues =
        extent(barsConfig.data.map((d) => d.value))[1] *
          Math.pow(10, numDecimalPlaces) +
        1;
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are correctly formatted', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
    it('does not have duplicate tick values', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        const uniqueTickValues = [...new Set(tickValues)];
        expect(tickValues.length).toEqual(uniqueTickValues.length);
      });
    });
    it('does not have more than the possible number of tick values given formatter', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues.length).toBeLessThanOrEqual(possibleValues);
      });
    });
  });
  describe('user specifies numTicks and data max is less than first possible value given formatter', () => {
    beforeEach(() => {
      axisConfig.numTicks = 10;
      barsConfig.data = [
        { state: 'Alabama', value: 0.01 },
        { state: 'Alaska', value: 0.04 },
        { state: 'Arizona', value: 0.08 },
      ];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are formatted as floats with the correct number of decimal places - case .1f', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
    it('has only one tick and that tick is at zero and correctly formatted', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['0.0']);
      });
    });
  });
});

describe('percent formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: VicBarsConfig;
  let axisConfig: VicAxisConfig;
  const declarations = [TestXQuantitativeAxisComponent];
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
      { state: 'Alabama', value: 0.011 },
      { state: 'Alaska', value: 0.022 },
      { state: 'Arizona', value: 0.303 },
    ];
    barsConfig.labels = new VicBarsLabelsConfig();
    barsConfig.labels.display = true;
    axisConfig = new VicAxisConfig();
    axisConfig.tickFormat = '.0%';
    validFormatRegex = /^(\d|[1-9]\d+)%$/;
  });
  describe('only tickFormat is specified by the user', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are formatted as percentages with the correct number of decimal places - case .0%', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not the correct format', () => {
    beforeEach(() => {
      axisConfig.tickValues = [0.01, 0.027, 0.07, 0.2121];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has the specified tick values, rounded to the nearest integer', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['1%', '3%', '7%', '21%']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer possible formatted values than numTicks', () => {
    let possibleValues: number;
    beforeEach(() => {
      axisConfig.numTicks = 100;
      barsConfig.data = [
        { state: 'Alabama', value: 0.011 },
        { state: 'Alaska', value: 0.022 },
        { state: 'Arizona', value: 0.303 },
      ];
      const numDecimalPlaces = 2;
      possibleValues =
        extent(barsConfig.data.map((d) => d.value))[1] *
          Math.pow(10, numDecimalPlaces) +
        1;
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are correctly formatted', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
    it('does not have duplicate tick values', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        const uniqueTickValues = [...new Set(tickValues)];
        expect(tickValues.length).toEqual(uniqueTickValues.length);
      });
    });
    it('does not have more than the possible number of tick values given formatter', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues.length).toBeLessThanOrEqual(possibleValues);
      });
    });
  });
  describe('user specifies numTicks and data max is less than first possible value given formatter', () => {
    beforeEach(() => {
      axisConfig.numTicks = 10;
      barsConfig.data = [
        { state: 'Alabama', value: 0.001 },
        { state: 'Alaska', value: 0.004 },
        { state: 'Arizona', value: 0.008 },
      ];
      cy.mount(TestXQuantitativeAxisComponent, {
        declarations,
        imports,
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(100);
    });
    it('has ticks that are formatted as floats with the correct number of decimal places - case .1f', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).toEqual(validFormatRegex as any);
        });
      });
    });
    it('has only one tick and that tick is at zero and correctly formatted', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).toEqual(['0%']);
      });
    });
  });
});
