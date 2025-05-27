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
import {
  stateIncomePopulationYearData,
  StateIncomePopulationYearDatum,
} from 'libs/viz-components/src/lib/testing/data/state-population-income-year-data';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import * as topojson from 'topojson-client';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';

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
  standalone: false,
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
    .resize({ useViewbox: false })
    .getConfig();
}

const mountGeographiesComponent = (
  geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >
): void => {
  const declarations = [TestGeographiesComponent];
  const imports = [VicChartModule, VicGeographiesModule];

  cy.mount(TestGeographiesComponent, {
    declarations,
    imports,
    componentProperties: {
      geographiesConfig: geographiesConfig,
    },
  });
};

// ***********************************************************
// Test dimension
// ***********************************************************
describe('the No Bins Attribute Data dimension', () => {
  let geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  it('it colors the paths according to the data and the users/the default range', () => {
    // Note: use colors where only one rbg color channel varies so that it's possible to test data values.
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
        .attributeDataLayer((layer) =>
          layer
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .noBins((dimension) =>
              dimension
                .valueAccessor((d) => d.income)
                .range(['white', '#ff00ff'])
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const sortedData = attributeData
        .slice()
        .sort((a, b) => a.income - b.income);
      const lowest = sortedData[0].state.replace(/\s/g, '-');
      const highest = sortedData[sortedData.length - 1].state.replace(
        /\s/g,
        '-'
      );
      cy.get(`.vic-geographies-group.${lowest} path`).then((path) => {
        expect(path.attr('fill')).to.eq('rgb(255, 255, 255)');
      });
      cy.get(`.vic-geographies-group.${highest} path`).then((path) => {
        expect(path.attr('fill')).to.eq('rgb(255, 0, 255)');
      });
      const colors = [255];
      sortedData.forEach((d, i) => {
        const state = d.state.replace(/\s/g, '-');
        cy.get(`.vic-geographies-group.${state} path`).then((path) => {
          const color = parseInt(path.attr('fill').split('(')[1].split(',')[1]);
          expect(color).to.be.lte(colors[i]);
          colors.push(color);
        });
      });
    });
  });

  it('it colors undefined, null, and non-quant values with null color', () => {
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
        .attributeDataLayer((layer) =>
          layer
            .data(dataWithFalsyValues)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .noBins((dimension) =>
              dimension
                .valueAccessor((d) => d.income)
                .range(['white', '#ff00ff'])
                .nullColor(nullColor)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      cy.get(`.vic-geographies-group.Florida path`).then((path) => {
        expect(path.attr('fill')).to.eq(nullColor);
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
    // they wil be drawn with any projection but let's use geoMercator to make them a bit more visible-ish
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
        .featureIndexAccessor((d) => d.properties.name)
        .projection(geoMercator())
        .attributeDataLayer((layer) =>
          layer
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .noBins((dimension) =>
              dimension
                .valueAccessor((d) => d.income)
                .range(['white', '#ff00ff'])
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
        .map((x) => x.properties.name.replace(/\s/g, '-'));
      geographiesNotInAttributeData.forEach((state) => {
        cy.get(`.vic-geographies-group.${state} path`).then((path) => {
          expect(path.attr('fill')).to.eq(nullColor);
        });
      });
    });
  });
});
