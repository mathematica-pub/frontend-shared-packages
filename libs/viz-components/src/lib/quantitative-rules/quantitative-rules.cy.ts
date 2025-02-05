import { Component, Input } from '@angular/core';
import 'cypress-real-events';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import {
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicQuantitativeRulesModule,
  VicXOrdinalAxisConfigBuilder,
  VicXOrdinalAxisModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '../../public-api';
import { VicOrdinalAxisConfig } from '../axes/ordinal/ordinal-axis-config';
import { VicQuantitativeAxisConfig } from '../axes/quantitative/quantitative-axis-config';
import { XQuantitativeAxisConfig } from '../axes/x-quantitative/x-quantitative-axis-config';
import { YQuantitativeAxisConfig } from '../axes/y-quantitative-axis/y-quantitative-axis-config';
import { BarsConfig } from '../bars/config/bars-config';
import { LinesConfig } from '../lines/config/lines-config';
import {
  continentPopulationDateYearData,
  ContinentPopulationDateYearDatum,
  ContinentPopulationNumYearData,
  ContinentPopulationNumYearDatum,
} from '../testing/data/continent-population-year-data';
import {
  countryFactsData,
  CountryFactsDatum,
} from '../testing/data/country-area-continent';
import { VicQuantitativeRulesConfigBuilder } from './config/quantitative-rules-builder';
import { QuantitativeRulesConfig } from './config/quantitative-rules-config';

// Cypress will get the tick elements before d3 has set the text value of the elements,
// because d3 creates the elements and sets the text value in a transition).
// This wait time is necessary to ensure that the text value of the tick elements has been set by d3.
const axisTickTextWaitTime = 100;

// ***********************************************************
// BAR CHARTS
// ***********************************************************

const barsHorizontalMargin = { top: 36, right: 20, bottom: 4, left: 80 };
const barsVerticalMargin = { top: 20, right: 20, bottom: 4, left: 40 };
const barsChartHeight = 400;
const barsChartWidth = 600;

const groupSelector = '.vic-quantitative-rules-group';
const ruleSelector = '.vic-quantitative-rules-rule';
const labelSelector = '.vic-quantitative-rules-label';

// ***********************************************************
// Horizontal bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-quantitative-rules-horizontal-bar',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g vic-y-ordinal-axis [config]="yOrdinalAxisConfig"></svg:g>
        <svg:g
          vic-primary-marks-bars
          [config]="barsConfig"
          (vicBarsHoverMoveOutput)="updateTooltipForNewOutput($event)"
        ></svg:g>
        <svg:g vic-quantitative-rules [config]="rulesConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestQuantitativeRulesHorizontalBarsComponent {
  @Input() barsConfig: BarsConfig<CountryFactsDatum, string>;
  @Input() rulesConfig: QuantitativeRulesConfig<number>;
  @Input() yOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = barsHorizontalMargin;
  chartHeight = barsChartHeight;
  chartWidth = barsChartWidth;
}

const mountHorizontalBarsComponent = (
  rulesConfig: QuantitativeRulesConfig<number>
): void => {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder()
    .tickFormat(',.0f')
    .getConfig();
  const yAxisConfig = new VicYOrdinalAxisConfigBuilder().getConfig();
  const barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
    .data(countryFactsData)
    .horizontal((bars) =>
      bars
        .x((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .y((dimension) => dimension.valueAccessor((d) => d.country))
    )
    .labels((labels) => labels.display(true))
    .getConfig();
  const declarations = [TestQuantitativeRulesHorizontalBarsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicXyChartModule,
    VicQuantitativeRulesModule,
  ];

  cy.mount(TestQuantitativeRulesHorizontalBarsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      rulesConfig: rulesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yOrdinalAxisConfig: yAxisConfig,
    },
  });
  cy.wait(axisTickTextWaitTime); // axes do not get drawn quickly enough without this - due to pattern of subscribing to chart scales
};

// ***********************************************************
// Vertical bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-quantitative-rules-vertical-bar',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g vic-x-ordinal-axis [config]="xOrdinalAxisConfig"></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g
          vic-primary-marks-bars
          [config]="barsConfig"
          [vicBarsHoverMoveActions]="hoverAndMoveActions"
          (vicBarsHoverMoveOutput)="updateTooltipForNewOutput($event)"
        ></svg:g>
        <svg:g vic-quantitative-rules [config]="rulesConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestVerticalBarsComponent {
  @Input() barsConfig: BarsConfig<CountryFactsDatum, string>;
  @Input() rulesConfig: QuantitativeRulesConfig<number>;
  @Input() xOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() yQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = barsVerticalMargin;
  chartHeight = barsChartHeight;
  chartWidth = barsChartWidth;
}

const mountVerticalBarsComponent = (
  rulesConfig: QuantitativeRulesConfig<number>
): void => {
  const xAxisConfig = new VicXOrdinalAxisConfigBuilder().getConfig();
  const yAxisConfig = new VicYQuantitativeAxisConfigBuilder()
    .tickFormat('.0f')
    .getConfig();
  const barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
    .data(countryFactsData)
    .vertical((bars) =>
      bars
        .x((dimension) => dimension.valueAccessor((d) => d.country))
        .y((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
    )
    .labels((labels) => labels.display(true))
    .getConfig();

  const declarations = [TestVerticalBarsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    VicXyChartModule,
    VicQuantitativeRulesModule,
  ];

  cy.mount(TestVerticalBarsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      rulesConfig: rulesConfig,
      xOrdinalAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
  cy.wait(axisTickTextWaitTime); // axes do not get drawn quickly enough without this - due to pattern of subscribing to chart scales
};

const linesMargin = { top: 60, right: 20, bottom: 40, left: 80 };
const linesChartHeight = 400;
const linesChartWidth = 600;
const linesDateData = continentPopulationDateYearData;
const linesNumericData = ContinentPopulationNumYearData;

// ***********************************************************
// LINE CHART
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-lines',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
        ></svg:g>
        <svg:g
          vic-primary-marks-lines
          [config]="linesConfig"
          [vicLinesHoverMoveActions]="hoverActions"
          (vicLinesHoverMoveOutput)="updateTooltipForNewOutput($event)"
        ></svg:g>
        <svg:g vic-quantitative-rules [config]="rulesConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestLinesComponent<
  Datum,
  QuantAxisType extends number | Date,
  RuleDatum extends number | Date,
> {
  @Input() linesConfig: LinesConfig<Datum>;
  @Input() rulesConfig: QuantitativeRulesConfig<RuleDatum>;
  @Input() yQuantitativeAxisConfig: YQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: XQuantitativeAxisConfig<QuantAxisType>;
  margin = linesMargin;
  chartHeight = linesChartHeight;
  chartWidth = linesChartWidth;
}

const lineImports = [
  VicChartModule,
  VicLinesModule,
  VicXQuantitativeAxisModule,
  VicYQuantitativeAxisModule,
  VicXyChartModule,
  VicQuantitativeRulesModule,
];

function mountDateLinesComponent<RuleDatum extends number | Date>(
  rulesConfig: QuantitativeRulesConfig<RuleDatum>
): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<Date>()
    .tickFormat('%Y')
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
  const linesConfig =
    new VicLinesConfigBuilder<ContinentPopulationDateYearDatum>()
      .data(linesDateData)
      .xDate((dimension) => dimension.valueAccessor((d) => d.year))
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .stroke((stroke) =>
        stroke.color((color) => color.valueAccessor((d) => d.continent))
      )
      .getConfig();
  const declarations = [
    TestLinesComponent<ContinentPopulationDateYearDatum, Date, RuleDatum>,
  ];
  cy.mount(
    TestLinesComponent<ContinentPopulationDateYearDatum, Date, RuleDatum>,
    {
      declarations,
      imports: lineImports,
      componentProperties: {
        linesConfig: linesConfig,
        rulesConfig: rulesConfig,
        xQuantitativeAxisConfig: xAxisConfig,
        yQuantitativeAxisConfig: yAxisConfig,
      },
    }
  );
  cy.wait(axisTickTextWaitTime); // have to wait for axes to render
}

function mountNumberLinesComponent(
  rulesConfig: QuantitativeRulesConfig<number>
): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
    .tickFormat('.0f')
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
  const linesConfig =
    new VicLinesConfigBuilder<ContinentPopulationNumYearDatum>()
      .data(linesNumericData)
      .xNumeric((dimension) =>
        dimension.valueAccessor((d) => d.year).includeZeroInDomain(false)
      )
      .y((dimension) => dimension.valueAccessor((d) => d.population))
      .stroke((stroke) =>
        stroke.color((color) => color.valueAccessor((d) => d.continent))
      )
      .getConfig();
  const declarations = [
    TestLinesComponent<ContinentPopulationNumYearDatum, number, number>,
  ];
  cy.mount(
    TestLinesComponent<ContinentPopulationNumYearDatum, number, number>,
    {
      declarations,
      imports: lineImports,
      componentProperties: {
        linesConfig: linesConfig,
        rulesConfig: rulesConfig,
        xQuantitativeAxisConfig: xAxisConfig,
        yQuantitativeAxisConfig: yAxisConfig,
      },
    }
  );
  cy.wait(axisTickTextWaitTime); // have to wait for axes to render
}

// ***********************************************************
// Creating the correct rules - horizontal bars, vertical rule + labels
// ***********************************************************
describe('it creates the correct rules and labels - vertical rules on horizontal bars', () => {
  let rulesConfig: QuantitativeRulesConfig<number>;
  beforeEach(() => {
    rulesConfig = undefined;
  });
  it('draws one rule per item in the data array with the specified color string', () => {
    const ruleData = [200000, 500000];
    const ruleColor = 'magenta';
    rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('vertical')
      .data(ruleData)
      .color(ruleColor)
      .getConfig();
    mountHorizontalBarsComponent(rulesConfig);
    cy.get(groupSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).each(($rule) => {
      expect($rule.attr('stroke')).to.equal(ruleColor);
    });
  });
  it('draws one rule per item in the data array using the color function', () => {
    const ruleData = [200000, 500000];
    const getColor = (d: number) => (d < 300000 ? 'chartreuse' : 'magenta');
    rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('vertical')
      .data(ruleData)
      .color(getColor)
      .getConfig();
    mountHorizontalBarsComponent(rulesConfig);
    cy.get(ruleSelector).each(($rule, index) => {
      if (index === 0) {
        expect($rule.attr('stroke')).to.equal('chartreuse');
      } else {
        expect($rule.attr('stroke')).to.equal('magenta');
      }
    });
  });
  it('draws the user-specified labels - no label color specified, no value specified', () => {
    const ruleData = [200000, 500000];
    const getColor = (d: number) => (d < 300000 ? 'chartreuse' : 'magenta');
    rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('vertical')
      .data(ruleData)
      .color(getColor)
      .labels()
      .getConfig();
    mountHorizontalBarsComponent(rulesConfig);
    cy.get(groupSelector).each(($group, index) => {
      if (index === 0) {
        expect($group.find(ruleSelector).attr('stroke')).to.equal('chartreuse');
        expect($group.find(labelSelector).attr('fill')).to.equal('chartreuse');
        expect($group.find(labelSelector).text()).to.equal(
          `${ruleData[index]}`
        );
      } else {
        expect($group.find(ruleSelector).attr('stroke')).to.equal('magenta');
        expect($group.find(labelSelector).attr('fill')).to.equal('magenta');
        expect($group.find(labelSelector).text()).to.equal(
          `${ruleData[index]}`
        );
      }
    });
  });
  it('draws the user-specified labels - specified label color and value', () => {
    const ruleData = [200000, 500000];
    const getColor = (d: number) => (d < 300000 ? 'chartreuse' : 'magenta');
    rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('vertical')
      .data(ruleData)
      .color(getColor)
      .labels((labels) =>
        labels
          .color((d) => (d < 300000 ? 'green' : 'hotpink'))
          .value((d) => (d < 300000 ? 'pretty big' : 'really big'))
      )
      .getConfig();
    mountHorizontalBarsComponent(rulesConfig);
    cy.get(groupSelector).each(($group, index) => {
      if (index === 0) {
        expect($group.find(ruleSelector).attr('stroke')).to.equal('chartreuse');
        expect($group.find(labelSelector).attr('fill')).to.equal('green');
        expect($group.find(labelSelector).text()).to.equal('pretty big');
      } else {
        expect($group.find(ruleSelector).attr('stroke')).to.equal('magenta');
        expect($group.find(labelSelector).attr('fill')).to.equal('hotpink');
        expect($group.find(labelSelector).text()).to.equal('really big');
      }
    });
  });
});

// ***********************************************************
// Creating the correct rules - vertical bars, horizontal rule + labels
// ***********************************************************
describe('it creates the correct rules and labels - horizontal rules on vertical bars', () => {
  let rulesConfig: QuantitativeRulesConfig<number>;
  beforeEach(() => {
    rulesConfig = undefined;
  });
  it('draws one rule per item in the data array with the specified color string', () => {
    const ruleData = [200000, 500000];
    const getColor = (d: number) => (d < 300000 ? 'chartreuse' : 'magenta');
    rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('horizontal')
      .data(ruleData)
      .color(getColor)
      .labels((labels) =>
        labels
          .color((d) => (d < 300000 ? 'green' : 'hotpink'))
          .value((d) => (d < 300000 ? 'pretty big' : 'really big'))
      )
      .getConfig();
    mountVerticalBarsComponent(rulesConfig);
    cy.get(groupSelector).each(($group, index) => {
      if (index === 0) {
        expect(
          $group.find('.vic-quantitative-rules-rule').attr('stroke')
        ).to.equal('chartreuse');
        expect($group.find(labelSelector).attr('fill')).to.equal('green');
        expect($group.find(labelSelector).text()).to.equal('pretty big');
      } else {
        expect(
          $group.find('.vic-quantitative-rules-rule').attr('stroke')
        ).to.equal('magenta');
        expect($group.find(labelSelector).attr('fill')).to.equal('hotpink');
        expect($group.find(labelSelector).text()).to.equal('really big');
      }
    });
  });
});

// ***********************************************************
// Creating the correct rules - date line chart
// ***********************************************************
describe('it creates the correct rules and labels on a date line chart', () => {
  it('draws a horizontal line on the chart with the correct color and label value', () => {
    const ruleData = [1000000000];
    const ruleColor = 'magenta';
    const rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('horizontal')
      .data(ruleData)
      .color(ruleColor)
      .labels()
      .getConfig();
    mountDateLinesComponent<number>(rulesConfig);
    cy.get(groupSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).each(($rule) => {
      expect($rule.attr('stroke')).to.equal(ruleColor);
    });
    cy.get(labelSelector).each(($rule, index) => {
      expect($rule.text()).to.equal(`${ruleData[index]}`);
    });
  });
  it('draws a vertical line on the chart with the correct color and label value', () => {
    const ruleData = [new Date('2042-01-01')];
    const ruleColor = 'magenta';
    const rulesConfig = new VicQuantitativeRulesConfigBuilder<Date>()
      .orientation('vertical')
      .data(ruleData)
      .color(ruleColor)
      .labels((labels) => labels.value(() => 'no return'))
      .getConfig();
    mountDateLinesComponent<Date>(rulesConfig);
    cy.get(groupSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).each(($rule) => {
      expect($rule.attr('stroke')).to.equal(ruleColor);
    });
    cy.get(labelSelector).each(($rule) => {
      expect($rule.text()).to.equal('no return');
    });
  });
});

// ***********************************************************
// Creating the correct rules - number line chart
// ***********************************************************
describe('it creates the correct rules and labels on a number line chart', () => {
  it('draws a horizontal line on the chart with the correct color and label value', () => {
    const ruleData = [1000000000];
    const ruleColor = 'magenta';
    const rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('horizontal')
      .data(ruleData)
      .color(ruleColor)
      .labels()
      .getConfig();
    mountNumberLinesComponent(rulesConfig);
    cy.get(groupSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).each(($rule) => {
      expect($rule.attr('stroke')).to.equal(ruleColor);
    });
    cy.get(labelSelector).each(($rule, index) => {
      expect($rule.text()).to.equal(`${ruleData[index]}`);
    });
  });
  it('draws a vertical line on the chart with the correct color and label value', () => {
    const ruleData = [2042];
    const ruleColor = 'magenta';
    const rulesConfig = new VicQuantitativeRulesConfigBuilder<number>()
      .orientation('vertical')
      .data(ruleData)
      .color(ruleColor)
      .labels((labels) => labels.value(() => 'no return'))
      .getConfig();
    mountNumberLinesComponent(rulesConfig);
    cy.get(groupSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).should('have.length', ruleData.length);
    cy.get(ruleSelector).each(($rule) => {
      expect($rule.attr('stroke')).to.equal(ruleColor);
    });
    cy.get(labelSelector).each(($rule) => {
      expect($rule.text()).to.equal('no return');
    });
  });
});
