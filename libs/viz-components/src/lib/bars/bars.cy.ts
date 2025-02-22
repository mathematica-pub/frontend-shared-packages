import { Component, Input } from '@angular/core';
import 'cypress-real-events';
import { format, max } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import {
  VicXOrdinalAxisConfigBuilder,
  VicXQuantitativeAxisConfigBuilder,
  VicYOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfigBuilder,
} from '../axes';
import { VicOrdinalAxisConfig } from '../axes/ordinal/ordinal-axis-config';
import { VicQuantitativeAxisConfig } from '../axes/quantitative/quantitative-axis-config';
import { VicXOrdinalAxisModule } from '../axes/x-ordinal/x-ordinal-axis.module';
import { VicXQuantitativeAxisModule } from '../axes/x-quantitative/x-quantitative-axis.module';
import { VicYOrdinalAxisModule } from '../axes/y-ordinal/y-ordinal-axis.module';
import { VicYQuantitativeAxisModule } from '../axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicChartModule } from '../charts/chart/chart.module';
import { VicXyChartModule } from '../charts/xy-chart/xy-chart.module';
import { EventAction, HoverMoveAction } from '../events/action';
import {
  countryFactsData,
  CountryFactsDatum,
} from '../testing/data/country-area-continent';
import { VicHtmlTooltipConfigBuilder } from '../tooltips/html-tooltip/config/html-tooltip-builder';
import { HtmlTooltipConfig } from '../tooltips/html-tooltip/config/html-tooltip-config';
import { VicHtmlTooltipModule } from '../tooltips/html-tooltip/html-tooltip.module';
import { VicBarsModule } from './bars.module';
import { VicBarsConfigBuilder } from './config/bars-builder';
import { BarsConfig } from './config/bars-config';
import { BarsHoverEmitTooltipData } from './events/actions/bars-hover-actions';
import { BarsHoverMoveEmitTooltipData } from './events/actions/bars-hover-move-actions';
import { BarsEventOutput } from './events/bars-event-output';
import { BarsHoverMoveDirective } from './events/bars-hover-move.directive';
import { BarsHoverDirective } from './events/bars-hover.directive';

// Cypress will get the tick elements before d3 has set the text value of the elements,
// because d3 creates the elements and sets the text value in a transition).
// This wait time is necessary to ensure that the text value of the tick elements has been set by d3.
const axisTickTextWaitTime = 1000;

const horizontalMargin = { top: 36, right: 20, bottom: 4, left: 80 };
const verticalMargin = { top: 20, right: 20, bottom: 4, left: 40 };
const chartHeight = 400;
const chartWidth = 600;
const tooltipYOffset = 30;
const getXTransform = ($barGroup) => {
  const [x] = $barGroup
    .attr('transform')
    .split('(')[1]
    .split(')')[0]
    .split(',');
  return parseFloat(x);
};
const getYTransform = ($barGroup) => {
  const [, y] = $barGroup
    .attr('transform')
    .split('(')[1]
    .split(')')[0]
    .split(',');
  return parseFloat(y);
};

const groupSelector = '.vic-bars-group';
const barSelector = '.vic-bars-bar';
const labelSelector = '.vic-bars-label';

// ***********************************************************
// Horizontal bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-horizontal-bar',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
      [transitionDuration]="0"
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
          [vicBarsHoverActions]="hoverAndMoveActions"
          (vicBarsHoverOutput)="updateTooltipForNewOutput($event)"
        >
          <vic-html-tooltip
            [config]="tooltipConfig$ | async"
            [template]="htmlTooltip"
          ></vic-html-tooltip>
        </svg:g>
      </ng-container>
    </vic-xy-chart>

    <ng-template #htmlTooltip>
      <p class="x-value">{{ (tooltipData$ | async).values.x }}</p>
      <p class="y-value">{{ (tooltipData$ | async).values.y }}</p>
    </ng-template>
  `,
  styles: [],
})
class TestHorizontalBarsComponent {
  @Input() barsConfig: BarsConfig<CountryFactsDatum, string>;
  @Input() yOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = horizontalMargin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<CountryFactsDatum, string>> =
    new BehaviorSubject<BarsEventOutput<CountryFactsDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    BarsHoverMoveDirective<CountryFactsDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];

  updateTooltipForNewOutput(
    data: BarsEventOutput<CountryFactsDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput<CountryFactsDatum, string>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput<CountryFactsDatum, string>): void {
    const config = new VicHtmlTooltipConfigBuilder()
      .barsPosition(data?.origin, [
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY : undefined,
        },
      ])
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}

const mountHorizontalBarsComponent = (
  barsConfig: BarsConfig<CountryFactsDatum, string>
): void => {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder()
    .tickFormat(',.0f')
    .getConfig();
  const yAxisConfig = new VicYOrdinalAxisConfigBuilder().getConfig();
  const declarations = [TestHorizontalBarsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicXyChartModule,
    VicHtmlTooltipModule,
  ];

  cy.mount(TestHorizontalBarsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yOrdinalAxisConfig: yAxisConfig,
    },
  });
};

// ***********************************************************
// Vertical bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-vertical-bar',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
      [transitionDuration]="0"
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
          [vicBarsHoverActions]="hoverActions"
          (vicBarsHoverOutput)="updateTooltipForNewOutput($event)"
        >
          <vic-html-tooltip
            [config]="tooltipConfig$ | async"
            [template]="htmlTooltip"
          ></vic-html-tooltip>
        </svg:g>
      </ng-container>
    </vic-xy-chart>

    <ng-template #htmlTooltip>
      <p>{{ (tooltipData$ | async).values.y }}</p>
    </ng-template>
  `,
  styles: [],
})
class TestVerticalBarsComponent {
  @Input() barsConfig: BarsConfig<CountryFactsDatum, string>;
  @Input() xOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() yQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = verticalMargin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<CountryFactsDatum, string>> =
    new BehaviorSubject<BarsEventOutput<CountryFactsDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: EventAction<BarsHoverDirective<CountryFactsDatum, string>>[] = [
    new BarsHoverEmitTooltipData(),
  ];

  updateTooltipForNewOutput(
    data: BarsEventOutput<CountryFactsDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput<CountryFactsDatum, string>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput<CountryFactsDatum, string>): void {
    const config = new VicHtmlTooltipConfigBuilder()
      .barsPosition(data?.origin, [
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - tooltipYOffset : undefined,
        },
      ])
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}

const mountVerticalBarsComponent = (
  barsConfig: BarsConfig<CountryFactsDatum, string>
): void => {
  const xAxisConfig = new VicXOrdinalAxisConfigBuilder().getConfig();
  const yAxisConfig = new VicYQuantitativeAxisConfigBuilder()
    .tickFormat('.0f')
    .getConfig();

  const declarations = [TestVerticalBarsComponent];
  const imports = [
    VicChartModule,
    VicBarsModule,
    VicXOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    VicXyChartModule,
    VicHtmlTooltipModule,
  ];

  cy.mount(TestVerticalBarsComponent, {
    declarations,
    imports,
    componentProperties: {
      barsConfig: barsConfig,
      xOrdinalAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
};

function getHorizontalConfig(
  data: CountryFactsDatum[]
): BarsConfig<CountryFactsDatum, string> {
  return new VicBarsConfigBuilder<CountryFactsDatum, string>()
    .data(data)
    .horizontal((bars) =>
      bars
        .x((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .y((dimension) => dimension.valueAccessor((d) => d.country))
    )
    .labels((labels) => labels.display(true))
    .getConfig();
}

function getVerticalConfig(
  data: CountryFactsDatum[]
): BarsConfig<CountryFactsDatum, string> {
  return new VicBarsConfigBuilder<CountryFactsDatum, string>()
    .data(data)
    .vertical((bars) =>
      bars
        .y((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .x((dimension) => dimension.valueAccessor((d) => d.country))
    )
    .labels((labels) => labels.display(true))
    .getConfig();
}

// ***********************************************************
// Creating the correct bars in the correct order - functionality is agnostic to direction
// ***********************************************************
describe('it creates the correct bars in the correct order for the data', () => {
  let barsConfig: BarsConfig<CountryFactsDatum, string>;
  beforeEach(() => {
    barsConfig = undefined;
  });
  describe('if a user does not provide an explicit ordinal domain', () => {
    it('creates one bar and one ordinal axis tick per datum when data has no repeated ordinal values', () => {
      barsConfig = getHorizontalConfig(countryFactsData);
      mountHorizontalBarsComponent(barsConfig);
      cy.wait(axisTickTextWaitTime);
      cy.get(groupSelector).should('have.length', countryFactsData.length);
      cy.get(barSelector).should('have.length', countryFactsData.length);
      // D3 draws the top axis tick first, so we need to reverse the data to match the order of the axis ticks
      const reversedData = countryFactsData.slice().reverse();
      cy.get('.vic-axis-y-ordinal .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(reversedData[index].country);
      });
      cy.get('.vic-bars-label').each(($label, index) => {
        expect($label.text()).to.equal(countryFactsData[index].area.toString());
      });
    });
    it('creates one bar and one ordinal axis tick per unique ordinal value and uses the first of the repeated ordinal values when data has datums with duplicate ordinal values', () => {
      barsConfig = getHorizontalConfig([
        countryFactsData[0],
        countryFactsData.find((x) => x.country === 'Afghanistan'),
        ...countryFactsData.slice(1),
      ]);
      mountHorizontalBarsComponent(barsConfig);
      cy.wait(axisTickTextWaitTime);
      cy.get(groupSelector).should('have.length', countryFactsData.length);
      cy.get(barSelector).should('have.length', countryFactsData.length);
      // D3 draws the top axis tick first, so we need to reverse the data to match the order of the axis ticks
      const reversedData = countryFactsData.slice().reverse();
      cy.get('.vic-axis-y-ordinal .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(reversedData[index].country);
      });
      // Below tests that it did not use the second Afghanistan value
      cy.get(labelSelector).each(($label, index) => {
        expect($label.text()).to.equal(countryFactsData[index].area.toString());
      });
    });
  });
  describe('if a user provides an explicit ordinal domain', () => {
    const ordinalDomain = ['Afghanistan', 'Albania', 'Angola'];
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
        .data(countryFactsData)
        .vertical((bars) =>
          bars
            .y((dimension) =>
              dimension.valueAccessor((d) => d.area).domainPaddingPixels(50)
            )
            .x((dimension) =>
              dimension.valueAccessor((d) => d.country).domain(ordinalDomain)
            )
        )
        .labels((labels) => labels.display(true))
        .getConfig();
    });
    it('creates one bar and one ordinal axis tick per value in the provided domain and does not create bars for data not in domain', () => {
      mountVerticalBarsComponent(barsConfig);
      cy.wait(axisTickTextWaitTime);
      cy.get(groupSelector).should('have.length', ordinalDomain.length);
      cy.get(barSelector).should('have.length', ordinalDomain.length);
      // D3 draws the top axis tick first, so we need to reverse the domain to match the order of the axis ticks
      cy.get('.vic-axis-x-ordinal .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(ordinalDomain[index]);
      });
    });
    it('sets the quantitative domain according to all quantitative values in all of the data including those datums which are not drawn in the chart because of restricted domain', () => {
      mountVerticalBarsComponent(barsConfig);
      cy.wait(axisTickTextWaitTime);
      cy.get('.vic-axis-y-quantitative .tick text').then((ticks) => {
        const lastTickValue = ticks[ticks.length - 1].innerHTML;
        // expect "above" because we are adding 20 px of padding to the domain
        expect(parseFloat(lastTickValue)).to.be.above(
          max(countryFactsData.map((d) => d.area))
        );
      });
    });
    it('creates one bar and one ordinal axis tick per ordinal value in the domain and uses the first of the repeated ordinal values when data has datums with duplicate ordinal values', () => {
      barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
        .data([
          ...countryFactsData,
          countryFactsData.find((x) => x.country === 'Afghanistan'),
        ])
        .vertical((bars) =>
          bars
            .y((dimension) =>
              dimension.valueAccessor((d) => d.area).domainPaddingPixels()
            )
            .x((dimension) =>
              dimension.valueAccessor((d) => d.country).domain(ordinalDomain)
            )
        )
        .labels((labels) => labels.display(true))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
      cy.wait(axisTickTextWaitTime);
      cy.get(groupSelector).should('have.length', ordinalDomain.length);
      cy.get(barSelector).should('have.length', ordinalDomain.length);
      // D3 draws the top axis tick first, so we need to reverse the data to match the order of the axis ticks
      cy.get('.vic-axis-x-ordinal .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(ordinalDomain[index]);
      });
      cy.get(labelSelector).first().should('have.text', '252072');
    });
  });
});

// Note: We do not test the functionality of the D3 scale, per policy of not testing external libs
// This means that we do not attempt to assert that the height/width is the correct height/width for the data value, not do we test the value of the ordinal dimension of the bar.
// Additionally, we test setting the quantitative domain under various conditions -- user-specified domain, user-specified includeZeroInDomain -- in the quantitative domain tests.
// ***********************************************************
// Bars are the correct size in the quantitative dimension
// ***********************************************************
[
  {
    mountFunction: mountHorizontalBarsComponent,
    orientation: 'horizontal',
    barAttr: 'width',
  },
  {
    mountFunction: mountVerticalBarsComponent,
    orientation: 'vertical',
    barAttr: 'height',
  },
].forEach(({ mountFunction, orientation, barAttr }) => {
  describe('bars have the expected size in the quantitative dimension', () => {
    let barsConfig: BarsConfig<CountryFactsDatum, string>;
    let testData: CountryFactsDatum[];
    beforeEach(() => {
      barsConfig = undefined;
      testData = cloneDeep(countryFactsData);
    });
    describe(`bars are ${orientation}`, () => {
      it(`a bar has a ${barAttr} of 0 if the quantitative value is 0`, () => {
        const zeroIndex = 2;
        testData[zeroIndex].area = 0;
        if (orientation === 'horizontal') {
          barsConfig = getHorizontalConfig(testData);
        } else {
          barsConfig = getVerticalConfig(testData);
        }
        mountFunction(barsConfig);
        cy.get(barSelector).each(($bar, i) => {
          const size = parseFloat($bar.attr(barAttr));
          if (i === zeroIndex) {
            expect(size).to.equal(0);
          } else {
            expect(size).to.be.above(0);
          }
        });
      });
      it(`a bar has a ${barAttr} of 0 if the quantitative value is non numeric`, () => {
        const nonNumericIndex = 3;
        testData[nonNumericIndex].area = undefined;
        if (orientation === 'horizontal') {
          barsConfig = getHorizontalConfig(testData);
        } else {
          barsConfig = getVerticalConfig(testData);
        }
        mountFunction(barsConfig);
        cy.get(barSelector).each(($bar, i) => {
          const size = parseFloat($bar.attr(barAttr));
          if (i === nonNumericIndex) {
            expect(size).to.equal(0);
          } else {
            expect(size).to.be.above(0);
          }
        });
      });
      it(`has bars with the correct ${barAttr} when some values are negative`, () => {
        const negativeIndex = 1;
        testData[negativeIndex].area = testData[negativeIndex + 1].area * -1;
        if (orientation === 'horizontal') {
          barsConfig = getHorizontalConfig(testData);
        } else {
          barsConfig = getVerticalConfig(testData);
        }
        mountFunction(barsConfig);
        cy.get(barSelector).then(($bars) => {
          const sizes = [];
          cy.wrap($bars).each(($bar) => {
            const size = parseFloat($bar.attr(barAttr));
            sizes.push(size);
          });
          expect(sizes[negativeIndex]).to.equal(sizes[negativeIndex + 1]);
        });
      });
      it('has bars that extend beyond the domain if the quantitative value is greater than the domain max - CORRECT BEHAVIOR CAUSES VISUAL ERROR', () => {
        const partialBuilder = new VicBarsConfigBuilder<
          CountryFactsDatum,
          string
        >()
          .data(testData)
          .labels((labels) => labels.display(true));
        if (orientation === 'horizontal') {
          barsConfig = partialBuilder
            .horizontal((bars) =>
              bars
                .x((dimension) =>
                  dimension
                    .valueAccessor((d) => d.area)
                    .domain([0, 700000])
                    .domainPaddingPixels()
                )
                .y((dimension) => dimension.valueAccessor((d) => d.country))
            )
            .getConfig();
        } else {
          barsConfig = partialBuilder
            .vertical((bars) =>
              bars
                .y((dimension) =>
                  dimension
                    .valueAccessor((d) => d.area)
                    .domain([0, 700000])
                    .domainPaddingPixels()
                )
                .x((dimension) => dimension.valueAccessor((d) => d.country))
            )
            .getConfig();
        }
        mountFunction(barsConfig);
        cy.get(barSelector)
          .eq(2)
          .then(($bar) => {
            const size = parseFloat($bar.attr(barAttr));
            const axisSelector =
              orientation === 'horizontal'
                ? '.vic-axis-y-ordinal'
                : '.vic-axis-x-ordinal';
            cy.get<SVGPathElement>(`${axisSelector} .domain`).then((domain) => {
              const domainRect = domain[0].getBBox();
              expect(size).to.be.above(domainRect[barAttr]);
            });
          });
      });
      it(`has bars with the correct ${barAttr} when values are negative and the smallest values is less than the domain min - CORRECT BEHAVIOR CAUSES VISUAL ERROR`, () => {
        const negativeIndex = 1;
        testData[negativeIndex].area = testData[negativeIndex + 1].area * -1;
        const partialBuilder = new VicBarsConfigBuilder<
          CountryFactsDatum,
          string
        >()
          .data(testData)
          .labels((labels) => labels.display(true));
        if (orientation === 'horizontal') {
          barsConfig = partialBuilder
            .horizontal((bars) =>
              bars
                .x((dimension) =>
                  dimension
                    .valueAccessor((d) => d.area)
                    .domain([0, 1000000])
                    .domainPaddingPixels()
                )
                .y((dimension) => dimension.valueAccessor((d) => d.country))
            )
            .getConfig();
        } else {
          barsConfig = partialBuilder
            .vertical((bars) =>
              bars
                .y((dimension) =>
                  dimension
                    .valueAccessor((d) => d.area)
                    .domain([0, 1000000])
                    .domainPaddingPixels()
                )
                .x((dimension) => dimension.valueAccessor((d) => d.country))
            )
            .getConfig();
        }
        mountFunction(barsConfig);
        cy.get(barSelector).then(($bars) => {
          const sizes = [];
          cy.wrap($bars).each(($bar) => {
            const size = parseFloat($bar.attr(barAttr));
            sizes.push(size);
          });
          expect(sizes[negativeIndex]).to.equal(sizes[negativeIndex + 1]);
        });
      });
    });
  });
  describe('bars all have the same size in the ordinal dimension', () => {
    let barsConfig: BarsConfig<CountryFactsDatum, string>;
    beforeEach(() => {
      barsConfig = undefined;
    });
    it(`bars are ${orientation} and have the same ${barAttr}`, () => {
      if (orientation === 'horizontal') {
        barsConfig = getHorizontalConfig(countryFactsData);
      } else {
        barsConfig = getVerticalConfig(countryFactsData);
      }
      mountFunction(barsConfig);
      cy.get(barSelector).then(($bars) => {
        const sizes = [];
        cy.wrap($bars).each(($bar) => {
          const size = parseFloat($bar.attr(barAttr));
          sizes.push(size);
        });
        expect(sizes.every((size) => size === sizes[0])).to.be.true;
      });
    });
  });
});

// ***********************************************************
// Bars are correctly positioned in the quantitative dimension
// ***********************************************************
describe('bars have the expected origin in the quantitative dimension', () => {
  let barsConfig: BarsConfig<CountryFactsDatum, string>;
  let testData: CountryFactsDatum[];
  beforeEach(() => {
    barsConfig = undefined;
    testData = cloneDeep(countryFactsData);
    cy.viewport(800, 600);
  });
  describe('all values are positive', () => {
    it('has bars that start at the left chart margin if bars are horizontal', () => {
      barsConfig = getHorizontalConfig(testData);
      mountHorizontalBarsComponent(barsConfig);
      cy.get(groupSelector).then(($barGroups) => {
        cy.wrap($barGroups).each(($barGroup) => {
          const origin = getXTransform($barGroup);
          const margin = horizontalMargin.left;
          expect(origin).to.equal(margin);
        });
      });
    });
    it('has bars that start at the bottom chart margin if bars are vertical', () => {
      barsConfig = getVerticalConfig(testData);
      mountVerticalBarsComponent(barsConfig);
      cy.get(groupSelector).then(($barGroups) => {
        cy.wrap($barGroups).each(($barGroup) => {
          const origin = getYTransform($barGroup);
          cy.wrap($barGroup)
            .find(barSelector)
            .then(($bar) => {
              const barHeight = parseFloat($bar.attr('height'));
              expect(barHeight + origin).to.equal(
                chartHeight - verticalMargin.bottom
              );
            });
        });
      });
    });
  });
  describe('values are positive and negative', () => {
    let negativeBarIndex: number;
    it('has bars whose negative bars end at the start of the positive bars - bars are horizontal', () => {
      negativeBarIndex = 2;
      testData[negativeBarIndex].area = -testData[negativeBarIndex].area;
      barsConfig = getHorizontalConfig(testData);
      mountHorizontalBarsComponent(barsConfig);
      cy.get(groupSelector).then(($barGroups) => {
        cy.wrap($barGroups)
          .first()
          .then(($firstBarGroup) => {
            const positiveOrigin = getXTransform($firstBarGroup);
            cy.wrap($barGroups)
              .eq(negativeBarIndex)
              .then(($negativeBarGroup) => {
                const negativeOrigin = getXTransform($negativeBarGroup);
                cy.wrap($negativeBarGroup)
                  .find(barSelector)
                  .then(($negativeBar) => {
                    const width = parseFloat($negativeBar.attr('width'));
                    expect(negativeOrigin + width).to.equal(positiveOrigin);
                  });
              });
          });
      });
    });
    it('has bars whose negative bars end at the start of the positive bars - bars are vertical', () => {
      negativeBarIndex = 2;
      testData[negativeBarIndex].area = -testData[negativeBarIndex].area;
      barsConfig = getVerticalConfig(testData);
      mountVerticalBarsComponent(barsConfig);
      cy.get(groupSelector).then(($barGroups) => {
        cy.wrap($barGroups)
          .first()
          .then(($firstBarGroup) => {
            const positiveYTransform = getYTransform($firstBarGroup);
            cy.wrap($firstBarGroup)
              .find(barSelector)
              .then(($positiveBar) => {
                const barHeight = parseFloat($positiveBar.attr('height'));
                const positiveOrigin = positiveYTransform + barHeight;
                cy.wrap($barGroups)
                  .eq(negativeBarIndex)
                  .then(($negativeBarGroup) => {
                    const negativeOrigin = getYTransform($negativeBarGroup);
                    expect(negativeOrigin).to.equal(positiveOrigin);
                  });
              });
          });
      });
    });
  });
  describe('values are all negative', () => {
    beforeEach(() => {
      // ensure that chart can reach specified width of 600px, default cy viewport is 500 x 500
      cy.viewport(800, 600);
    });
    it('aligns all bars to the far right when bars are horizontal', () => {
      testData.forEach((d) => {
        d.area = -d.area;
      });
      barsConfig = getHorizontalConfig(testData);
      mountHorizontalBarsComponent(barsConfig);
      cy.get(groupSelector).then(($barGroups) => {
        cy.wrap($barGroups).each(($barGroup) => {
          const origin = getXTransform($barGroup);
          cy.wrap($barGroup)
            .find(barSelector)
            .then(($bar) => {
              const width = parseFloat($bar.attr('width'));
              expect(origin + width + horizontalMargin.right).to.equal(
                chartWidth
              );
            });
        });
      });
    });
    it('aligns all bars to the top when bars are vertical', () => {
      testData.forEach((d) => {
        d.area = -d.area;
      });
      barsConfig = getVerticalConfig(testData);
      mountVerticalBarsComponent(barsConfig);
      cy.get(groupSelector).then(($barGroups) => {
        cy.wrap($barGroups).each(($barGroup) => {
          const origin = getYTransform($barGroup);
          expect(origin).to.equal(verticalMargin.top);
        });
      });
    });
  });
});

// ***********************************************************
// Tests of tooltips
// ***********************************************************
describe('displays tooltips for correct data per hover position', () => {
  beforeEach(() => {
    const barsConfig = new VicBarsConfigBuilder<CountryFactsDatum, string>()
      .data(countryFactsData)
      .horizontal((bars) =>
        bars
          .x((dimension) =>
            dimension
              .valueAccessor((d) => d.area)
              .formatFunction((d) => format('.1f')(d.area))
              .domainPaddingPixels()
          )
          .y((dimension) =>
            dimension
              .valueAccessor((d) => d.country)
              .formatFunction((d) => d.country.toUpperCase())
          )
      )
      .labels((labels) => labels.display(true))
      .getConfig();
    mountHorizontalBarsComponent(barsConfig);
  });

  countryFactsData.forEach((_, i) => {
    describe(`Data point at index ${i}`, () => {
      beforeEach(() => {
        cy.get(barSelector).eq(i).realHover();
      });
      it('is okay', () => {
        cy.get('svg').should('exist');
      });
      it('displays a tooltip', () => {
        cy.get('.vic-html-tooltip-overlay').should('be.visible');
      });
      it('tooltip displays correctly formatted data', () => {
        cy.get('.x-value').should(
          'have.text',
          format('.1f')(countryFactsData[i].area)
        );
        cy.get('.y-value').should(
          'have.text',
          countryFactsData[i].country.toUpperCase()
        );
      });
      it('tooltip appears at the correct position', () => {
        cy.get('.vic-html-tooltip-overlay').then(($el) => {
          const tooltipBox = $el[0].getBoundingClientRect();
          cy.get(barSelector)
            .eq(i)
            .then(($el) => {
              const barBox = $el[0].getBoundingClientRect();
              expect((tooltipBox.left + tooltipBox.right) / 2).to.be.closeTo(
                (barBox.left + barBox.right) / 2,
                5
              );
              expect(tooltipBox.bottom).to.be.closeTo(
                (barBox.top + barBox.bottom) / 2,
                10
              );
            });
        });
      });
    });
  });
});

// ***********************************************************
// Fill of bars tested under categorical.cy.ts
// ***********************************************************
