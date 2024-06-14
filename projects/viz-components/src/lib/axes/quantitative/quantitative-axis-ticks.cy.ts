/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { VicXQuantitativeAxisModule } from '@hsi/viz-components';
import 'cypress/support/component';
import { extent } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { VicBarsModule } from '../../bars/bars.module';
import { VicBarsOptions } from '../../bars/config/bars.config';
import { VicChartModule } from '../../chart/chart.module';
import { Vic } from '../../config/vic';
import { VicXyChartModule } from '../../xy-chart/xy-chart.module';
import { VicQuantitativeAxisConfig } from './quantitative-axis.config';

@Component({
  selector: 'vic-test-x-quantitative-axis',
  template: `
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
  @Input() barsConfig: VicBarsOptions<{ state: string; value: number }, string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = { top: 20, right: 20, bottom: 20, left: 20 };
}

describe('it correctly sets ticks', () => {
  let barsConfig: VicBarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicQuantitativeAxisConfig<number>;
  const declarations = [TestXQuantitativeAxisComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = Vic.barsHorizontal({
      data: [
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 30.3 },
      ],
      ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
      quantitative: Vic.dimensionQuantitative({
        valueAccessor: (d) => d.value,
      }),
      categorical: Vic.dimensionCategorical(),
      labels: Vic.barsLabels({ display: true }),
    });
    axisConfig = Vic.axisXQuantitative({
      tickFormat: '.0f',
    });
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
        expect(Number(lastTick.textContent)).to.be.at.most(
          barsConfig.data.map((d) => d.value).reduce((a, b) => Math.max(a, b))
        );
      });
    });
  });
  describe('tick values are specified by user', () => {
    beforeEach(() => {
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0f',
        tickValues: [1, 2, 7, 21],
      });
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
        expect(tickValues).to.deep.equal(axisConfig.tickValues.map(String));
      });
    });
  });
  describe('tick values are specified by user - tick values are outside of data range', () => {
    beforeEach(() => {
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0f',
        tickValues: [-1, 1, 2, 7, 21, 100],
      });
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
        expect(tickValues).to.deep.equal(['1', '2', '7', '21']);
      });
    });
  });
});

describe('integer formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: VicBarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicQuantitativeAxisConfig<number>;
  const declarations = [TestXQuantitativeAxisComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    Vic.axisXQuantitativeModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = Vic.barsHorizontal({
      data: [
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 30.3 },
      ],
      ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
      quantitative: Vic.dimensionQuantitative({
        valueAccessor: (d) => d.value,
      }),
      categorical: Vic.dimensionCategorical(),
      labels: Vic.barsLabels({ display: true }),
    });
    axisConfig = Vic.axisXQuantitative({
      tickFormat: '.0f',
    });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not integers', () => {
    beforeEach(() => {
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0f',
        tickValues: [1.1, 2.2, 7.7, 21.21],
      });
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
        expect(tickValues).to.deep.equal(['1', '2', '8', '21']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer integer values than numTicks', () => {
    beforeEach(() => {
      barsConfig = Vic.barsHorizontal({
        data: [
          { state: 'Alabama', value: 1.1 },
          { state: 'Alaska', value: 2.2 },
          { state: 'Arizona', value: 3.3 },
        ],
        ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
        quantitative: Vic.dimensionQuantitative({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical(),
        labels: Vic.barsLabels({ display: true }),
      });
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0f',
        numTicks: 100,
      });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick per integer in the domain / does not have duplicate tick values', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0', '1', '2', '3']);
      });
    });
  });
  describe('user specifies numTicks and data max is less than 1 (first possible value given formatter)', () => {
    beforeEach(() => {
      barsConfig = Vic.barsHorizontal({
        data: [
          { state: 'Alabama', value: 0.1 },
          { state: 'Alaska', value: 0.4 },
          { state: 'Arizona', value: 0.8 },
        ],
        ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
        quantitative: Vic.dimensionQuantitative({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical(),
        labels: Vic.barsLabels({ display: true }),
      });
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0f',
        numTicks: 10,
      });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick and that tick is at zero', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0']);
      });
    });
  });
});

describe('float formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: VicBarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicQuantitativeAxisConfig<number>;
  const declarations = [TestXQuantitativeAxisComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    Vic.axisXQuantitativeModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = Vic.barsHorizontal({
      data: [
        { state: 'Alabama', value: 1.1 },
        { state: 'Alaska', value: 2.2 },
        { state: 'Arizona', value: 30.3 },
      ],
      ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
      quantitative: Vic.dimensionQuantitative({
        valueAccessor: (d) => d.value,
      }),
      categorical: Vic.dimensionCategorical(),
      labels: Vic.barsLabels({ display: true }),
    });
    axisConfig = Vic.axisXQuantitative({
      tickFormat: '.1f',
    });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not the correct format', () => {
    beforeEach(() => {
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.1f',
        tickValues: [1, 2.27, 7.0, 21.21],
      });
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
    it('has the specified tick values, rounded to the nearest tenth', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['1.0', '2.3', '7.0', '21.2']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer possible formatted values than numTicks', () => {
    let possibleValues: number;
    beforeEach(() => {
      barsConfig = Vic.barsHorizontal({
        data: [
          { state: 'Alabama', value: 1.1 },
          { state: 'Alaska', value: 2.2 },
          { state: 'Arizona', value: 3.3 },
        ],
        ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
        quantitative: Vic.dimensionQuantitative({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical(),
        labels: Vic.barsLabels({ display: true }),
      });
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.1f',
        numTicks: 100,
      });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('does not have duplicate tick values', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        const uniqueTickValues = [...new Set(tickValues)];
        expect(tickValues.length).to.deep.equal(uniqueTickValues.length);
      });
    });
    it('does not have more than the possible number of tick values given formatter', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues.length).to.be.at.most(possibleValues);
      });
    });
  });
  describe('user specifies numTicks and data max is less than first possible value given formatter', () => {
    beforeEach(() => {
      barsConfig = Vic.barsHorizontal({
        data: [
          { state: 'Alabama', value: 0.01 },
          { state: 'Alaska', value: 0.04 },
          { state: 'Arizona', value: 0.08 },
        ],
        ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
        quantitative: Vic.dimensionQuantitative({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical(),
        labels: Vic.barsLabels({ display: true }),
      });
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.1f',
        numTicks: 10,
      });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick and that tick is at zero and correctly formatted', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0.0']);
      });
    });
  });
});

describe('percent formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: VicBarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicQuantitativeAxisConfig<number>;
  const declarations = [TestXQuantitativeAxisComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    Vic.axisXQuantitativeModule,
    VicXyChartModule,
  ];
  beforeEach(() => {
    barsConfig = Vic.barsHorizontal({
      data: [
        { state: 'Alabama', value: 0.011 },
        { state: 'Alaska', value: 0.022 },
        { state: 'Arizona', value: 0.303 },
      ],
      ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
      quantitative: Vic.dimensionQuantitative({
        valueAccessor: (d) => d.value,
      }),
      categorical: Vic.dimensionCategorical(),
      labels: Vic.barsLabels({ display: true }),
    });
    axisConfig = Vic.axisXQuantitative({
      tickFormat: '.0%',
    });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not the correct format', () => {
    beforeEach(() => {
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0%',
        tickValues: [0.01, 0.027, 0.07, 0.2121],
      });
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
        expect(tickValues).to.deep.equal(['1%', '3%', '7%', '21%']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer possible formatted values than numTicks', () => {
    let possibleValues: number;
    beforeEach(() => {
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0%',
        numTicks: 100,
      });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('does not have duplicate tick values', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        const uniqueTickValues = [...new Set(tickValues)];
        expect(tickValues.length).to.deep.equal(uniqueTickValues.length);
      });
    });
    it('does not have more than the possible number of tick values given formatter', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues.length).to.be.at.most(possibleValues);
      });
    });
  });
  describe('user specifies numTicks and data max is less than first possible value given formatter', () => {
    beforeEach(() => {
      barsConfig = Vic.barsHorizontal({
        data: [
          { state: 'Alabama', value: 0.001 },
          { state: 'Alaska', value: 0.004 },
          { state: 'Arizona', value: 0.008 },
        ],
        ordinal: Vic.dimensionOrdinal({ valueAccessor: (d) => d.state }),
        quantitative: Vic.dimensionQuantitative({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical(),
        labels: Vic.barsLabels({ display: true }),
      });
      axisConfig = Vic.axisXQuantitative({
        tickFormat: '.0%',
        numTicks: 10,
      });
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
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick and that tick is at zero and correctly formatted', () => {
      cy.get('.vic-x.vic-axis-g .tick text').then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0%']);
      });
    });
  });
});
