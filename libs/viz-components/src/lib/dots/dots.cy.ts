// ***********************************************************
// Set up Lines component -- can use with Date or numeric values for x axis

import { Component, Input } from '@angular/core';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import {
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
  XQuantitativeAxisConfig,
  YQuantitativeAxisConfig,
} from '../axes';
import { VicChartModule, VicXyChartModule } from '../charts';
import {
  countryFactsData,
  CountryFactsDatum,
} from '../testing/data/country-area-continent';
import { VicHtmlTooltipModule } from '../tooltips';
import { VicDotsConfigBuilder } from './config/dots-builder';
import { DotsConfig } from './config/dots-config';
import { VicDotsModule } from './dots.module';

const margin = { top: 60, right: 20, bottom: 40, left: 80 };
const chartHeight = 400;
const chartWidth = 600;
const data = countryFactsData;
// const tooltipYOffset = 60; // need to offset otherwise the hover will be on the tooltip itself rather than svg

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
          side="bottom"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
          side="left"
        ></svg:g>
        <svg:g vic-primary-marks-dots [config]="dotsConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: ['.tooltip-text { font-size: 12px; }'],
})
class TestDotsComponent<Datum> {
  @Input() dotsConfig: DotsConfig<Datum>;
  @Input() yQuantitativeAxisConfig: YQuantitativeAxisConfig<number>;
  @Input() xQuantitativeAxisConfig: XQuantitativeAxisConfig<number>;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  // tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
  //   new BehaviorSubject<HtmlTooltipConfig>(null);
  // tooltipConfig$ = this.tooltipConfig.asObservable();
  // tooltipData: BehaviorSubject<LinesEventOutput<Datum>> = new BehaviorSubject<
  //   LinesEventOutput<Datum>
  // >(null);
  // tooltipData$ = this.tooltipData.asObservable();
  // hoverActions: HoverMoveAction<LinesHoverMoveDirective<Datum>>[] = [
  //   new LinesHoverMoveEmitTooltipData(),
  // ];

  // updateTooltipForNewOutput(data: LinesEventOutput<Datum>): void {
  //   this.updateTooltipData(data);
  //   this.updateTooltipConfig(data);
  // }

  // updateTooltipData(data: LinesEventOutput<Datum>): void {
  //   this.tooltipData.next(data);
  // }

  // updateTooltipConfig(data: LinesEventOutput<Datum>): void {
  //   const config = new VicHtmlTooltipConfigBuilder()
  //     .size((size) => size.minWidth(100))
  //     .linesPosition([
  //       {
  //         offsetX: data?.positionX,
  //         offsetY: data ? data.positionY - tooltipYOffset : 0,
  //       },
  //     ])
  //     .show(!!data)
  //     .getConfig();
  //   this.tooltipConfig.next(config);
  // }
}

const imports = [
  VicChartModule,
  VicDotsModule,
  VicXQuantitativeAxisModule,
  VicYQuantitativeAxisModule,
  VicXyChartModule,
  VicHtmlTooltipModule,
];

function mountDotsComponent(dotsConfig: DotsConfig<CountryFactsDatum>): void {
  const xAxisConfig = new VicXQuantitativeAxisConfigBuilder<number>()
    .tickFormat('.0f')
    .numTicks(5)
    .getConfig();
  const yAxisConfig =
    new VicYQuantitativeAxisConfigBuilder<number>().getConfig();
  const declarations = [TestDotsComponent<CountryFactsDatum>];
  cy.mount(TestDotsComponent<CountryFactsDatum>, {
    declarations,
    imports,
    componentProperties: {
      dotsConfig: dotsConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

// ***********************************************************
// Creating the dots
// ***********************************************************
describe('it creates one dot for each valid value in the data with the expected color and radius', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(data)
      .x((x) => x.valueAccessor((d) => d.population))
      .y((y) => y.valueAccessor((d) => d.gdpPerCapita))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .key((d) => d.country)
      .getConfig();
    mountDotsComponent(dotsConfig);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get('.vic-dot')
      .each(($dots) => {
        dotKeys.push($dots.attr('key'));
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
  it('should draw dots with the expected color', () => {
    const continents = [...new Set(data.map((d) => d.continent))];
    cy.get('.vic-dot').each((dots) => {
      const key = dots.attr('key');
      const continent = data.find((d) => d.country === key).continent;
      const expectedFill = colors[continents.indexOf(continent)];
      expect(dots.attr('fill')).to.equal(expectedFill);
    });
  });
  it('should draw dots with the expected radius', () => {
    const dotRadii = [];
    cy.get('.vic-dot')
      .each((dots) => {
        dotRadii.push({ country: dots.attr('key'), r: dots.attr('r') });
      })
      .then(() => {
        const countriesByRadius = dotRadii
          .slice()
          .sort((a, b) => a.r - b.r)
          .map((d) => d.country);
        const countriesByPopGrowth = data
          .slice()
          .sort((a, b) => a.popGrowth - b.popGrowth)
          .map((d) => d.country);
        expect(countriesByRadius).to.deep.equal(countriesByPopGrowth);
      });
  });
});

// ***********************************************************
// Positional data with negative values
// ***********************************************************
describe('it handles negative y-dimension values', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dataWithNegatives = cloneDeep(data);
    dataWithNegatives[0].gdpPerCapita = -10000;
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(dataWithNegatives)
      .x((x) => x.valueAccessor((d) => d.population))
      .y((y) => y.valueAccessor((d) => d.gdpPerCapita))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .key((d) => d.country)
      .getConfig();
    mountDotsComponent(dotsConfig);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get('.vic-dot')
      .each(($dots) => {
        dotKeys.push($dots.attr('key'));
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
});

describe('it handles negative x-dimension values', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dataWithNegatives = cloneDeep(data);
    dataWithNegatives[0].gdpPerCapita = -10000;
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(dataWithNegatives)
      .x((x) => x.valueAccessor((d) => d.gdpPerCapita))
      .y((y) => y.valueAccessor((d) => d.population))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .key((d) => d.country)
      .getConfig();
    mountDotsComponent(dotsConfig);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get('.vic-dot')
      .each(($dots) => {
        dotKeys.push($dots.attr('key'));
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
});

// ***********************************************************
// Tooltips
// ***********************************************************
describe('it creates one dot for each valid value in the data with the expected color and radius', () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  beforeEach(() => {
    const dotsConfig = new VicDotsConfigBuilder<CountryFactsDatum>()
      .data(data)
      .x((x) => x.valueAccessor((d) => d.population))
      .y((y) => y.valueAccessor((d) => d.gdpPerCapita))
      .fillCategorical((fill) =>
        fill.valueAccessor((d) => d.continent).range(colors)
      )
      .radiusNumeric((radius) =>
        radius.valueAccessor((d) => d.popGrowth).range([2, 10])
      )
      .key((d) => d.country)
      .getConfig();
    mountDotsComponent(dotsConfig);
  });
  it('should draw one dot for each valid value in the data', () => {
    const dotKeys = [];
    cy.get('.vic-dot')
      .each(($dots) => {
        dotKeys.push($dots.attr('key'));
      })
      .then(() => {
        expect(dotKeys).to.have.members([
          ...new Set(data.map((d) => d.country)),
        ]);
      });
  });
  it('should draw dots with the expected color', () => {
    const continents = [...new Set(data.map((d) => d.continent))];
    cy.get('.vic-dot').each((dots) => {
      const key = dots.attr('key');
      const continent = data.find((d) => d.country === key).continent;
      const expectedFill = colors[continents.indexOf(continent)];
      expect(dots.attr('fill')).to.equal(expectedFill);
    });
  });
  it('should draw dots with the expected radius', () => {
    const dotRadii = [];
    cy.get('.vic-dot')
      .each((dots) => {
        dotRadii.push({ country: dots.attr('key'), r: dots.attr('r') });
      })
      .then(() => {
        const countriesByRadius = dotRadii
          .slice()
          .sort((a, b) => a.r - b.r)
          .map((d) => d.country);
        const countriesByPopGrowth = data
          .slice()
          .sort((a, b) => a.popGrowth - b.popGrowth)
          .map((d) => d.country);
        expect(countriesByRadius).to.deep.equal(countriesByPopGrowth);
      });
  });
});
