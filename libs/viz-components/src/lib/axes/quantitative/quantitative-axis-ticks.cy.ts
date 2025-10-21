/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import {
  BarsOptions,
  ChartConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
} from '@mathstack/viz';
import { extent } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';

// Cypress will get the tick elements before d3 has set the text value of the elements,
// because d3 creates the elements and sets the text value in a transition).
// This wait time is necessary to ensure that the text value of the tick elements has been set by d3.
const axisTickTextWaitTime = 1000;
const tickTextSelector = '.vic-axis-x-quantitative .tick text';

@Component({
  selector: 'vic-test-x-quantitative-axis',
  template: `
    <vic-xy-chart [config]="chartConfig">
      <ng-container svg-elements>
        <svg:g vic-xy-background></svg:g>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-primary-marks-bars [config]="barsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
  providers: [VicChartConfigBuilder],
  imports: [
    VicChartModule,
    VicBarsModule,
    VicXyAxisModule,
    VicXyBackgroundModule,
  ],
})
class TestXQuantitativeAxisComponent implements OnInit {
  @Input() barsConfig: BarsOptions<{ state: string; value: number }, string>;
  @Input() xQuantitativeAxisConfig: VicXQuantitativeAxisConfig<number>;
  chartConfig: ChartConfig;

  constructor(public chart: VicChartConfigBuilder) {}

  ngOnInit(): void {
    this.chartConfig = this.chart
      .maxHeight(800)
      .margin({ top: 20, right: 20, bottom: 20, left: 20 })
      .scalingStrategy('responsive-width')
      .getConfig();
  }
}

describe('it correctly sets ticks', () => {
  let barsConfig: BarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    axisConfig = new VicXQuantitativeAxisConfigBuilder()
      .ticks((ticks) => ticks.format('.0f'))
      .getConfig();
    barsConfig = new VicBarsConfigBuilder<
      { state: string; value: number },
      string
    >()
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
  });
  describe('only tickFormat is specified by the user', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has a last tick whose value is less than or equal to the max value', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const lastTick = ticks[ticks.length - 1];
        expect(Number(lastTick.textContent)).to.be.at.most(
          barsConfig.data.map((d) => d.value).reduce((a, b) => Math.max(a, b))
        );
      });
    });
  });
  describe('tick values are specified by user', () => {
    beforeEach(() => {
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.0f').values([1, 2, 7, 21]))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has the specified tick values', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(axisConfig.ticks.values.map(String));
      });
    });
  });
  describe('tick values are specified by user - tick values are outside of data range', () => {
    beforeEach(() => {
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.0f').values([-1, 1, 2, 7, 21, 100]))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has the specified tick values, excluding those that are outside of the data range', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['1', '2', '7', '21']);
      });
    });
  });
});

describe('integer formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: BarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<
      { state: string; value: number },
      string
    >()
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
    axisConfig = new VicXQuantitativeAxisConfigBuilder()
      .ticks((ticks) => ticks.format('.0f').count(2))
      .getConfig();
    validFormatRegex = /^\d+$/;
  });
  describe('only tickFormat is specified by the user', () => {
    it('has ticks that are formatted as specified -- case .0f', () => {
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });

    it('has no duplicate tick values', () => {
      barsConfig = new VicBarsConfigBuilder<
        { state: string; value: number },
        string
      >()
        .data([
          { state: 'Alabama', value: 0.3 },
          { state: 'Alaska', value: 1.2 },
          { state: 'Arizona', value: 0.7 },
        ])
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0', '1']);
      });
      barsConfig = new VicBarsConfigBuilder<
        { state: string; value: number },
        string
      >()
        .data([
          { state: 'Alabama', value: 0.3 },
          { state: 'Alaska', value: 1.9 },
          { state: 'Arizona', value: 0.7 },
        ])
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0', '1']);
      });
    });
  });
  describe('tick values are specified by user - specified values are not integers', () => {
    beforeEach(() => {
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.0f').values([1.1, 2.2, 7.7, 21.21]))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has the specified tick values, rounded to the nearest integer', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['1', '2', '8', '21']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer integer values than numTicks', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<
        { state: string; value: number },
        string
      >()
        .data([
          { state: 'Alabama', value: 1.1 },
          { state: 'Alaska', value: 2.2 },
          { state: 'Arizona', value: 3.3 },
        ])
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.0f').count(100))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are formatted as integers', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick per integer in the domain / does not have duplicate tick values', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0', '1', '2', '3']);
      });
    });
  });
  describe('user specifies numTicks and data max is less than 1 (first possible value given formatter)', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<
        { state: string; value: number },
        string
      >()
        .data([
          { state: 'Alabama', value: 0.1 },
          { state: 'Alaska', value: 0.4 },
          { state: 'Arizona', value: 0.8 },
        ])
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.0f').count(10))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are formatted as integers', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick and that tick is at zero', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0']);
      });
    });
  });
});

describe('float formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: BarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<
      { state: string; value: number },
      string
    >()
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
    axisConfig = new VicXQuantitativeAxisConfigBuilder()
      .ticks((ticks) => ticks.format('.1f'))
      .getConfig();
    validFormatRegex = /^(\d|[1-9]\d+)\.\d$/;
  });
  describe('only tickFormat is specified by the user', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are formatted as floats with the correct number of decimal places - case .1f', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not the correct format', () => {
    beforeEach(() => {
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.1f').values([1, 2.27, 7.0, 21.21]))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has the specified tick values, rounded to the nearest tenth', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['1.0', '2.3', '7.0', '21.2']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer possible formatted values than numTicks', () => {
    let possibleValues: number;
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<
        { state: string; value: number },
        string
      >()
        .data([
          { state: 'Alabama', value: 1.1 },
          { state: 'Alaska', value: 2.2 },
          { state: 'Arizona', value: 3.3 },
        ])
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.1f').count(100))
        .getConfig();
      const numDecimalPlaces = 1;
      possibleValues =
        extent(barsConfig.data.map((d) => d.value))[1] *
          Math.pow(10, numDecimalPlaces) +
        1;
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are correctly formatted', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('does not have duplicate tick values', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        const uniqueTickValues = [...new Set(tickValues)];
        expect(tickValues.length).to.deep.equal(uniqueTickValues.length);
      });
    });
    it('does not have more than the possible number of tick values given formatter', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues.length).to.be.at.most(possibleValues);
      });
    });
  });
  describe('user specifies numTicks and data max is less than first possible value given formatter', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<
        { state: string; value: number },
        string
      >()
        .data([
          { state: 'Alabama', value: 0.01 },
          { state: 'Alaska', value: 0.04 },
          { state: 'Arizona', value: 0.08 },
        ])
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.1f').count(10))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are formatted as floats with the correct number of decimal places - case .1f', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick and that tick is at zero and correctly formatted', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0.0']);
      });
    });
  });
});

describe('percent formatted ticks', () => {
  let validFormatRegex: RegExp;
  let barsConfig: BarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<
      { state: string; value: number },
      string
    >()
      .data([
        { state: 'Alabama', value: 0.011 },
        { state: 'Alaska', value: 0.022 },
        { state: 'Arizona', value: 0.303 },
      ])
      .horizontal((bars) =>
        bars
          .x((dimension) => dimension.valueAccessor((d) => d.value))
          .y((dimension) => dimension.valueAccessor((d) => d.state))
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    axisConfig = new VicXQuantitativeAxisConfigBuilder()
      .ticks((ticks) => ticks.format('.0%'))
      .getConfig();
    validFormatRegex = /^(\d|[1-9]\d+)%$/;
  });
  describe('only tickFormat is specified by the user', () => {
    beforeEach(() => {
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are formatted as percentages with the correct number of decimal places - case .0%', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
  });
  describe('tick values are specified by user - specified values are not the correct format', () => {
    beforeEach(() => {
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) =>
          ticks.format('.0%').values([0.01, 0.027, 0.07, 0.2121])
        )
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has the specified tick values, rounded to the nearest integer', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['1%', '3%', '7%', '21%']);
      });
    });
  });
  describe('user specifies numTicks and data range has fewer possible formatted values than numTicks', () => {
    let possibleValues: number;
    beforeEach(() => {
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.0%').count(100))
        .getConfig();
      const numDecimalPlaces = 2;
      possibleValues =
        extent(barsConfig.data.map((d) => d.value))[1] *
          Math.pow(10, numDecimalPlaces) +
        1;
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are correctly formatted', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('does not have duplicate tick values', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        const uniqueTickValues = [...new Set(tickValues)];
        expect(tickValues.length).to.deep.equal(uniqueTickValues.length);
      });
    });
    it('does not have more than the possible number of tick values given formatter', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues.length).to.be.at.most(possibleValues);
      });
    });
  });
  describe('user specifies numTicks and data max is less than first possible value given formatter', () => {
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<
        { state: string; value: number },
        string
      >()
        .data([
          { state: 'Alabama', value: 0.001 },
          { state: 'Alaska', value: 0.004 },
          { state: 'Arizona', value: 0.008 },
        ])
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.state))
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      axisConfig = new VicXQuantitativeAxisConfigBuilder()
        .ticks((ticks) => ticks.format('.0%').count(10))
        .getConfig();
      cy.mount(TestXQuantitativeAxisComponent, {
        componentProperties: {
          barsConfig: barsConfig,
          xQuantitativeAxisConfig: axisConfig,
        },
      });
      cy.wait(axisTickTextWaitTime);
    });
    it('has ticks that are correctly formatted', () => {
      cy.get(tickTextSelector).then((ticks) => {
        ticks.each((i, tick) => {
          expect(tick.textContent).to.match(validFormatRegex);
        });
      });
    });
    it('has only one tick and that tick is at zero and correctly formatted', () => {
      cy.get(tickTextSelector).then((ticks) => {
        const tickValues = ticks.toArray().map((tick) => tick.textContent);
        expect(tickValues).to.deep.equal(['0%']);
      });
    });
  });
});

describe('grid lines', () => {
  let barsConfig: BarsOptions<{ state: string; value: number }, string>;
  let axisConfig: VicXQuantitativeAxisConfig<number>;
  beforeEach(() => {
    barsConfig = new VicBarsConfigBuilder<
      { state: string; value: number },
      string
    >()
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
      .getConfig();
  });
  it('height matches chart area', () => {
    axisConfig = new VicXQuantitativeAxisConfigBuilder().grid().getConfig();
    cy.mount(TestXQuantitativeAxisComponent, {
      componentProperties: {
        barsConfig: barsConfig,
        xQuantitativeAxisConfig: axisConfig,
      },
    });
    cy.wait(axisTickTextWaitTime);
    cy.get('.vic-xy-background')
      .invoke('height')
      .then((backgroundHeight) => {
        cy.get('.vic-grid-line line').each(($line) => {
          cy.wrap($line)
            .invoke('attr', 'y2')
            .then((tickLineHeight) => {
              const absTickLineHeight = Math.abs(parseFloat(tickLineHeight));
              expect(absTickLineHeight).to.equal(backgroundHeight);
            });
        });
      });
  });
  it('number of lines matches number of ticks if no filter is specified', () => {
    axisConfig = new VicXQuantitativeAxisConfigBuilder()
      .ticks((ticks) => ticks.count(4))
      .grid()
      .getConfig();
    cy.mount(TestXQuantitativeAxisComponent, {
      componentProperties: {
        barsConfig: barsConfig,
        xQuantitativeAxisConfig: axisConfig,
      },
    });
    cy.wait(axisTickTextWaitTime);
    cy.get('.vic-grid-line').should('have.length', 4);
  });
  it('lines are visible for every other tick given a filter (excluding line overlapping axis)', () => {
    axisConfig = new VicXQuantitativeAxisConfigBuilder()
      .ticks((ticks) => ticks.count(4))
      .grid((grid) => grid.filter((i) => i % 2 === 0))
      .getConfig();
    cy.mount(TestXQuantitativeAxisComponent, {
      componentProperties: {
        barsConfig: barsConfig,
        xQuantitativeAxisConfig: axisConfig,
      },
    });
    cy.wait(axisTickTextWaitTime);
    cy.get('.vic-grid-line').each(($line, i) => {
      if (i % 2 === 0) {
        cy.wrap($line).should('not.have.css', 'display', 'none');
      } else {
        cy.wrap($line).should('have.css', 'display', 'none');
      }
    });
  });
});
