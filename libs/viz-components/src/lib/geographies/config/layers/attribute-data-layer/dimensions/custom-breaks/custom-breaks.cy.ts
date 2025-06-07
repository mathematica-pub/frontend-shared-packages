/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import {
  ChartConfig,
  GeographiesConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicGeographiesConfigBuilder,
  VicGeographiesModule,
} from '@hsi/viz-components';
import { geoMercator } from 'd3';
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import * as topojson from 'topojson-client';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';
import {
  StateIncomePopulationYearDatum,
  stateIncomePopulationYearData,
} from '../../../../../../testing/data/state-population-income-year-data';

const margin = { top: 36, right: 36, bottom: 36, left: 36 };
const chartHeight = 400;
const chartWidth = 600;
const attributeData = stateIncomePopulationYearData
  .filter((x) => x.year === 2020)
  .filter((x) => x.state !== 'Puerto Rico');

interface TestMapGeometryProperties extends GeoJsonProperties {
  name: string;
  id: string;
}

interface TestMapObjects extends Objects {
  country: GeometryCollection<TestMapGeometryProperties>;
  states: GeometryCollection<TestMapGeometryProperties>;
}

type TestUsMapTopology = Topology<TestMapObjects>;

// ***********************************************************
// Geographies component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-geographies',
  template: `
    <vic-map-chart [config]="chartConfig">
      <svg:g
        vic-primary-marks-geographies
        svg-elements
        [config]="geographiesConfig"
        [vicGeographiesHoverActions]="hoverActions"
        (vicGeographiesHoverOutput)="updateTooltipForNewOutput($event)"
      ></svg:g>
    </vic-map-chart>
  `,
  styles: [],
  imports: [VicChartModule, VicGeographiesModule],
})
class TestGeographiesComponent {
  @Input() geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .margin(margin)
    .width(chartWidth)
    .height(chartHeight)
    .scalingStrategy('responsive-both')
    .getConfig();
}

const mountGeographiesComponent = (
  geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >
): void => {
  cy.mount(TestGeographiesComponent, {
    componentProperties: {
      geographiesConfig: geographiesConfig,
    },
  });
};

// ***********************************************************
// Test dimension
// ***********************************************************
describe('the Custom Breaks Attribute Data dimension', () => {
  let geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  it('User provides break values - it colors states according to break values', () => {
    const breakValues = [40000, 55000, 70000, 85000, 100000];
    const rangeValues = ['red', 'orange', 'yellow', 'green'];
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .customBreaksBins((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .breakValues(breakValues)
                .range(rangeValues)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      rangeValues.forEach((color, i) => {
        const statesInAttributeData = attributeData
          .filter(
            (d) => d.income < breakValues[i + 1] && d.income >= breakValues[i]
          )
          .map((d) => d.state);
        statesInAttributeData.forEach((state) => {
          cy.get(
            `.vic-geographies-group.${state.split(' ').join('-')} path`
          ).then((path) => {
            expect(path.attr('fill')).to.eq(color);
          });
        });
      });
    });
  });

  it('User provides break values that do not cover full data range -- values below first value use first color, values above last value use last color', () => {
    const breakValues = [50000, 60000, 70000, 80000];
    const rangeValues = ['red', 'orange', 'yellow'];
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .customBreaksBins((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .breakValues(breakValues)
                .range(rangeValues)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const belowValues = attributeData
        .filter((d) => d.income < breakValues[0])
        .map((d) => d.state.replace(/\s/g, '-'));
      const aboveValues = attributeData
        .filter((d) => d.income >= breakValues[breakValues.length - 1])
        .map((d) => d.state.replace(/\s/g, '-'));
      [
        { data: belowValues, color: rangeValues[0] },
        { data: aboveValues, color: rangeValues[rangeValues.length - 1] },
      ].forEach((group) => {
        group.data.forEach((state) => {
          cy.get(
            `.vic-geographies-group.${state.split(' ').join('-')} path`
          ).then((path) => {
            expect(path.attr('fill')).to.eq(group.color);
          });
        });
      });
    });
  });

  it('User provides break values that are not in order - it colors states according to break values as though they were in ascending order', () => {
    const breakValues = [40000, 55000, 70000, 85000, 100000];
    const rangeValues = ['red', 'orange', 'yellow', 'green'];
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .customBreaksBins((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .breakValues([
                  breakValues[1],
                  breakValues[0],
                  breakValues[2],
                  breakValues[4],
                  breakValues[3],
                ])
                .range(rangeValues)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      rangeValues.forEach((color, i) => {
        const statesInAttributeData = attributeData
          .filter(
            (d) => d.income < breakValues[i + 1] && d.income >= breakValues[i]
          )
          .map((d) => d.state);
        statesInAttributeData.forEach((state) => {
          cy.get(
            `.vic-geographies-group.${state.split(' ').join('-')} path`
          ).then((path) => {
            expect(path.attr('fill')).to.eq(color);
          });
        });
      });
    });
  });

  it('it colors undefined, null, and non-quant values with null color', () => {
    const breakValues = [40000, 55000, 70000, 85000, 100000];
    const rangeValues = ['red', 'orange', 'yellow', 'green'];
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      const dataWithFalsyValues = attributeData.map((d) => {
        if (d.state === 'Texas') {
          return { ...d, income: null };
        } else if (d.state === 'California') {
          return { ...d, income: undefined };
        } else if (d.state === 'Florida') {
          return { ...d, income: 'Not a number' as unknown as number };
        } else {
          return d;
        }
      });
      const nullColor = 'chartreuse';
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(dataWithFalsyValues)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .customBreaksBins((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .breakValues(breakValues)
                .range(rangeValues)
                .nullColor(nullColor)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      cy.get(`.vic-geographies-group.Florida path`).then((path) => {
        expect(path.attr('fill')).to.eq(rangeValues[0]);
      });
      cy.get(`.vic-geographies-group.Texas path`).then((path) => {
        expect(path.attr('fill')).to.eq(nullColor);
      });
      cy.get(`.vic-geographies-group.California path`).then((path) => {
        expect(path.attr('fill')).to.eq(nullColor);
      });
    });
  });

  it('it colors geographies not in attribute data with the null color', () => {
    // island territories like American Samoa, Guam, etc. are not in the attribute data but are in the geojson
    // they will be drawn with any projection but let's use geoMercator to make them a bit more visible-ish
    const breakValues = [40000, 55000, 70000, 85000, 100000];
    const rangeValues = ['red', 'orange', 'yellow', 'green'];
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      const nullColor = 'chartreuse';
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .projection(geoMercator())
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .customBreaksBins((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .breakValues(breakValues)
                .range(rangeValues)
                .nullColor(nullColor)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const geographiesNotInAttributeData = states.features
        .filter(
          (x) =>
            attributeData.findIndex((d) => d.state === x.properties.name) === -1
        )
        .map((x) => x.properties.name);
      geographiesNotInAttributeData.forEach((state) => {
        cy.get(
          `.vic-geographies-group.${state.split(' ').join('-')} path`
        ).then((path) => {
          expect(path.attr('fill')).to.eq(nullColor);
        });
      });
    });
  });
});
