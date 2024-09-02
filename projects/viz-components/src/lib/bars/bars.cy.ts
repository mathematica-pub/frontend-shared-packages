import { Component, Input } from '@angular/core';
import 'cypress-real-events';
import { max } from 'd3';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import {
  BarsHoverMoveDirective,
  BarsHoverMoveEmitTooltipData,
  VicBarsConfigBuilder,
  VicHtmlTooltipConfigBuilder,
  VicXOrdinalAxisConfigBuilder,
  VicXQuantitativeAxisConfigBuilder,
  VicYOrdinalAxisConfigBuilder,
  VicYQuantitativeAxisConfigBuilder,
} from '../../public-api';
import { VicOrdinalAxisConfig } from '../axes/ordinal/ordinal-axis-config';
import { VicQuantitativeAxisConfig } from '../axes/quantitative/quantitative-axis-config';
import { VicXOrdinalAxisModule } from '../axes/x-ordinal/x-ordinal-axis.module';
import { VicXQuantitativeAxisModule } from '../axes/x-quantitative/x-quantitative-axis.module';
import { VicYOrdinalAxisModule } from '../axes/y-ordinal/y-ordinal-axis.module';
import { VicYQuantitativeAxisModule } from '../axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicChartModule } from '../chart/chart.module';
import { HoverMoveAction } from '../events/action';
import { QOCData, QOCDatum } from '../testing/data/quant-ord-cat-data';
import { HtmlTooltipConfig } from '../tooltips/html-tooltip/config/html-tooltip-config';
import { VicHtmlTooltipModule } from '../tooltips/html-tooltip/html-tooltip.module';
import { VicXyChartModule } from '../xy-chart/xy-chart.module';
import { VicBarsModule } from './bars.module';
import { BarsConfig } from './config/bars-config';
import { BarsEventOutput } from './events/bars-event-output';

const horizontalMargin = { top: 36, right: 20, bottom: 4, left: 80 };
const verticalMargin = { top: 20, right: 20, bottom: 4, left: 40 };
const chartHeight = 400;
const chartWidth = 600;
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
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
          side="top"
        ></svg:g>
        <svg:g
          vic-y-ordinal-axis
          [config]="yOrdinalAxisConfig"
          side="left"
        ></svg:g>
        <svg:g
          vic-data-marks-bars
          [config]="barsConfig"
          [vicBarsHoverMoveActions]="hoverAndMoveActions"
          (vicBarsHoverMoveOutput)="updateTooltipForNewOutput($event)"
        >
          <vic-html-tooltip
            [config]="tooltipConfig$ | async"
            [template]="htmlTooltip"
          ></vic-html-tooltip>
        </svg:g>
      </ng-container>
    </vic-xy-chart>

    <ng-template #htmlTooltip>
      <p>{{ (tooltipData$ | async).quantitative }}</p>
    </ng-template>
  `,
  styles: [],
})
class TestHorizontalBarsComponent {
  @Input() barsConfig: BarsConfig<QOCDatum, string>;
  @Input() yOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = horizontalMargin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<QOCDatum, string>> =
    new BehaviorSubject<BarsEventOutput<QOCDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    BarsHoverMoveDirective<QOCDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];

  updateTooltipForNewOutput(data: BarsEventOutput<QOCDatum, string>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput<QOCDatum, string>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput<QOCDatum, string>): void {
    const config = new VicHtmlTooltipConfigBuilder()
      .createOffsetFromOriginPosition((position) =>
        position
          .offsetX(data?.positionX)
          .offsetY(data ? data.positionY - 10 : undefined)
      )
      .origin(data ? data.elRef : undefined)
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}

const mountHorizontalBarsComponent = (
  barsConfig: BarsConfig<QOCDatum, string>
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
  cy.wait(100); // axes do not get drawn quickly enough without this - due to pattern of subscribing to chart scales
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
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-ordinal-axis
          [config]="xOrdinalAxisConfig"
          side="bottom"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
          side="left"
        ></svg:g>
        <svg:g
          vic-data-marks-bars
          [config]="barsConfig"
          [vicBarsHoverMoveActions]="hoverAndMoveActions"
          (vicBarsHoverMoveOutput)="updateTooltipForNewOutput($event)"
        >
          <vic-html-tooltip
            [config]="tooltipConfig$ | async"
            [template]="htmlTooltip"
          ></vic-html-tooltip>
        </svg:g>
      </ng-container>
    </vic-xy-chart>

    <ng-template #htmlTooltip>
      <p>{{ (tooltipData$ | async).quantitative }}</p>
    </ng-template>
  `,
  styles: [],
})
class TestVerticalBarsComponent {
  @Input() barsConfig: BarsConfig<QOCDatum, string>;
  @Input() xOrdinalAxisConfig: VicOrdinalAxisConfig<string>;
  @Input() yQuantitativeAxisConfig: VicQuantitativeAxisConfig<number>;
  margin = verticalMargin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<QOCDatum, string>> =
    new BehaviorSubject<BarsEventOutput<QOCDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    BarsHoverMoveDirective<QOCDatum, string>
  >[] = [new BarsHoverMoveEmitTooltipData()];

  updateTooltipForNewOutput(data: BarsEventOutput<QOCDatum, string>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput<QOCDatum, string>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput<QOCDatum, string>): void {
    const config = new VicHtmlTooltipConfigBuilder()
      .createOffsetFromOriginPosition((position) =>
        position
          .offsetX(data?.positionX)
          .offsetY(data ? data.positionY - 10 : undefined)
      )
      .origin(data ? data.elRef : undefined)
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}

const mountVerticalBarsComponent = (
  barsConfig: BarsConfig<QOCDatum, string>
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
  cy.wait(100); // axes do not get drawn quickly enough without this - due to pattern of subscribing to chart scales
};

// ***********************************************************
// Creating the correct bars in the correct order - functionality is agnostic to direction
// ***********************************************************
describe('it creates the correct bars in the correct order for the data', () => {
  let barsConfig: BarsConfig<QOCDatum, string>;
  beforeEach(() => {
    barsConfig = undefined;
  });
  describe('if a user does not provide an explicit ordinal domain', () => {
    it('creates one bar and one ordinal axis tick per datum when data has no repeated ordinal values', () => {
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').should('have.length', QOCData.length);
      cy.get('.vic-bar').should('have.length', QOCData.length);
      // D3 draws the top axis tick first, so we need to reverse the data to match the order of the axis ticks
      const reversedData = QOCData.slice().reverse();
      cy.get('.vic-y.vic-axis-g .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(reversedData[index].country);
      });
      cy.get('.vic-bar-label').each(($label, index) => {
        expect($label.text()).to.equal(QOCData[index].area.toString());
      });
    });
    it('creates one bar and one ordinal axis tick per unique ordinal value and uses the first of the repeated ordinal values when data has datums with duplicate ordinal values', () => {
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data([
          QOCData[0],
          { country: 'Afghanistan', area: 300000, continent: 'Asia' },
          ...QOCData.slice(1),
        ])
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').should('have.length', QOCData.length);
      cy.get('.vic-bar').should('have.length', QOCData.length);
      // D3 draws the top axis tick first, so we need to reverse the data to match the order of the axis ticks
      const reversedData = QOCData.slice().reverse();
      cy.get('.vic-y.vic-axis-g .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(reversedData[index].country);
      });
      // Below tests that it did not use the second Afghanistan value
      cy.get('.vic-bar-label').each(($label, index) => {
        expect($label.text()).to.equal(QOCData[index].area.toString());
      });
    });
  });
  describe('if a user provides an explicit ordinal domain', () => {
    const ordinalDomain = ['Afghanistan', 'Albania', 'Angola'];
    beforeEach(() => {
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('vertical')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country).domain(ordinalDomain)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels(50)
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
    });
    it('creates one bar and one ordinal axis tick per value in the provided domain and does not create bars for data not in domain', () => {
      mountVerticalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').should('have.length', ordinalDomain.length);
      cy.get('.vic-bar').should('have.length', ordinalDomain.length);
      // D3 draws the top axis tick first, so we need to reverse the domain to match the order of the axis ticks
      cy.get('.vic-x.vic-axis-g .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(ordinalDomain[index]);
      });
    });
    it('sets the quantitative domain according to all quantitative values in all of the data including those datums which are not drawn in the chart because of restricted domain', () => {
      mountVerticalBarsComponent(barsConfig);
      cy.get('.vic-y.vic-axis-g .tick text').then((ticks) => {
        const lastTickValue = ticks[ticks.length - 1].innerHTML;
        // expect "above" because we are adding 20 px of padding to the domain
        expect(parseFloat(lastTickValue)).to.be.above(
          max(QOCData.map((d) => d.area))
        );
      });
    });
    it('creates one bar and one ordinal axis tick per ordinal value in the domain and uses the first of the repeated ordinal values when data has datums with duplicate ordinal values', () => {
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('vertical')
        .data([
          ...QOCData,
          { country: 'Afghanistan', area: 300000, continent: 'Asia' },
        ])
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country).domain(ordinalDomain)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').should('have.length', ordinalDomain.length);
      cy.get('.vic-bar').should('have.length', ordinalDomain.length);
      // D3 draws the top axis tick first, so we need to reverse the data to match the order of the axis ticks
      cy.get('.vic-x.vic-axis-g .tick text').each(($tick, index) => {
        expect($tick.text()).to.equal(ordinalDomain[index]);
      });
      cy.get('.vic-bar-label').first().should('have.text', '252072');
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
    let barsConfig: BarsConfig<QOCDatum, string>;
    let testData: QOCDatum[];
    beforeEach(() => {
      barsConfig = undefined;
      testData = cloneDeep(QOCData);
    });
    describe(`bars are ${orientation}`, () => {
      it(`a bar has a ${barAttr} of 0 if the quantitative value is 0`, () => {
        const zeroIndex = 2;
        testData[zeroIndex].area = 0;
        barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
          .orientation(orientation as 'horizontal' | 'vertical')
          .data(testData)
          .createOrdinalDimension((dimension) =>
            dimension.valueAccessor((d) => d.country)
          )
          .createQuantitativeDimension((dimension) =>
            dimension.valueAccessor((d) => d.area).domainPaddingPixels()
          )
          .createLabels((labels) => labels.display(true))
          .getConfig();
        mountFunction(barsConfig);
        cy.get('.vic-bar').each(($bar, i) => {
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
        barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
          .orientation(orientation as 'horizontal' | 'vertical')
          .data(testData)
          .createOrdinalDimension((dimension) =>
            dimension.valueAccessor((d) => d.country)
          )
          .createQuantitativeDimension((dimension) =>
            dimension.valueAccessor((d) => d.area).domainPaddingPixels()
          )
          .createLabels((labels) => labels.display(true))
          .getConfig();
        mountFunction(barsConfig);
        cy.get('.vic-bar').each(($bar, i) => {
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
        barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
          .orientation(orientation as 'horizontal' | 'vertical')
          .data(testData)
          .createOrdinalDimension((dimension) =>
            dimension.valueAccessor((d) => d.country)
          )
          .createQuantitativeDimension((dimension) =>
            dimension.valueAccessor((d) => d.area).domainPaddingPixels()
          )
          .createLabels((labels) => labels.display(true))
          .getConfig();
        mountFunction(barsConfig);
        cy.get('.vic-bar').then(($bars) => {
          const sizes = [];
          cy.wrap($bars).each(($bar) => {
            const size = parseFloat($bar.attr(barAttr));
            sizes.push(size);
          });
          expect(sizes[negativeIndex]).to.equal(sizes[negativeIndex + 1]);
        });
      });
      it('has bars that extend beyond the domain if the quantitative value is greater than the domain max - CORRECT BEHAVIOR CAUSES VISUAL ERROR', () => {
        barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
          .orientation(orientation as 'horizontal' | 'vertical')
          .data(testData)
          .createOrdinalDimension((dimension) =>
            dimension.valueAccessor((d) => d.country)
          )
          .createQuantitativeDimension((dimension) =>
            dimension
              .valueAccessor((d) => d.area)
              .domain([0, 700000])
              .domainPaddingPixels()
          )
          .createLabels((labels) => labels.display(true))
          .getConfig();
        mountFunction(barsConfig);
        cy.get('.vic-bar')
          .eq(2)
          .then(($bar) => {
            const size = parseFloat($bar.attr(barAttr));
            const axisSelector =
              orientation === 'horizontal' ? '.vic-y' : '.vic-x';
            cy.get(`${axisSelector}.vic-axis-g .domain`).then((domain) => {
              const domainRect = (
                domain[0] as unknown as SVGPathElement
              ).getBBox();
              expect(size).to.be.above(domainRect[barAttr]);
            });
          });
      });
      it(`has bars with the correct ${barAttr} when values are negative and the smallest values is less than the domain min - CORRECT BEHAVIOR CAUSES VISUAL ERROR`, () => {
        const negativeIndex = 1;
        testData[negativeIndex].area = testData[negativeIndex + 1].area * -1;
        barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
          .orientation(orientation as 'horizontal' | 'vertical')
          .data(testData)
          .createOrdinalDimension((dimension) =>
            dimension.valueAccessor((d) => d.country)
          )
          .createQuantitativeDimension((dimension) =>
            dimension
              .valueAccessor((d) => d.area)
              .domain([0, 1000000])
              .domainPaddingPixels()
          )
          .createLabels((labels) => labels.display(true))
          .getConfig();
        mountFunction(barsConfig);
        cy.get('.vic-bar').then(($bars) => {
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
    let barsConfig: BarsConfig<QOCDatum, string>;
    beforeEach(() => {
      barsConfig = undefined;
    });
    it(`bars are ${orientation} and have the same ${barAttr}`, () => {
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation(orientation as 'horizontal' | 'vertical')
        .data(QOCData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountFunction(barsConfig);
      cy.get('.vic-bar').then(($bars) => {
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
  let barsConfig: BarsConfig<QOCDatum, string>;
  let testData: QOCDatum[];
  beforeEach(() => {
    barsConfig = undefined;
    testData = cloneDeep(QOCData);
    cy.viewport(800, 600);
  });
  describe('all values are positive', () => {
    it('has bars that start at the left chart margin if bars are horizontal', () => {
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(testData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').then(($barGroups) => {
        cy.wrap($barGroups).each(($barGroup) => {
          const origin = getXTransform($barGroup);
          const margin = horizontalMargin.left;
          expect(origin).to.equal(margin);
        });
      });
    });
    it('has bars that start at the bottom chart margin if bars are vertical', () => {
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('vertical')
        .data(testData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').then(($barGroups) => {
        cy.wrap($barGroups).each(($barGroup) => {
          const origin = getYTransform($barGroup);
          cy.wrap($barGroup)
            .find('.vic-bar')
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
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(testData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').then(($barGroups) => {
        cy.wrap($barGroups)
          .first()
          .then(($firstBarGroup) => {
            const positiveOrigin = getXTransform($firstBarGroup);
            cy.wrap($barGroups)
              .eq(negativeBarIndex)
              .then(($negativeBarGroup) => {
                const negativeOrigin = getXTransform($negativeBarGroup);
                cy.wrap($negativeBarGroup)
                  .find('.vic-bar')
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
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('vertical')
        .data(testData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').then(($barGroups) => {
        cy.wrap($barGroups)
          .first()
          .then(($firstBarGroup) => {
            const positiveYTransform = getYTransform($firstBarGroup);
            cy.wrap($firstBarGroup)
              .find('.vic-bar')
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
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('horizontal')
        .data(testData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountHorizontalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').then(($barGroups) => {
        cy.wrap($barGroups).each(($barGroup) => {
          const origin = getXTransform($barGroup);
          cy.wrap($barGroup)
            .find('.vic-bar')
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
      barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
        .orientation('vertical')
        .data(testData)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.area).domainPaddingPixels()
        )
        .createLabels((labels) => labels.display(true))
        .getConfig();
      mountVerticalBarsComponent(barsConfig);
      cy.get('.vic-bar-group').then(($barGroups) => {
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
    const barsConfig = new VicBarsConfigBuilder<QOCDatum, string>()
      .orientation('horizontal')
      .data(QOCData)
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.country)
      )
      .createQuantitativeDimension((dimension) =>
        dimension.valueAccessor((d) => d.area).domainPaddingPixels()
      )
      .createLabels((labels) => labels.display(true))
      .getConfig();
    mountHorizontalBarsComponent(barsConfig);
  });

  QOCData.forEach((_, i) => {
    describe(`Data point at index ${i}`, () => {
      beforeEach(() => {
        cy.get('.vic-bar').eq(i).realHover();
      });

      it('displays a tooltip', () => {
        cy.get('.vic-html-tooltip-overlay').should('be.visible');
      });

      it('tooltip displays correct data', () => {
        cy.get('.vic-html-tooltip-overlay p').should(
          'have.text',
          QOCData[i].area
        );
      });

      it('tooltip appears at the correct position', () => {
        cy.get('.vic-html-tooltip-overlay').then(($el) => {
          const tooltipBox = $el[0].getBoundingClientRect();
          cy.get('.vic-bar')
            .eq(i)
            .then(($el) => {
              const barBox = $el[0].getBoundingClientRect();
              expect((tooltipBox.left + tooltipBox.right) / 2).to.be.closeTo(
                (barBox.left + barBox.right) / 2,
                1
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
