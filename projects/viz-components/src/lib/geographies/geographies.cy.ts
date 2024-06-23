// For data layer, it should color the geographies according to the user specifications
// For each non-data layer, it should color the geographies according to the user specifications.
// It should draw the map
// It should draw the expected number of geographies

import { Component, Input } from '@angular/core';
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { beforeEach, cy, describe, it } from 'local-cypress';
import * as topojson from 'topojson-client';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';
import {
  VicGeographiesConfig,
  VicGeographiesModule,
  VicHtmlTooltipModule,
  VicMapChartModule,
} from '../../public-api';
import { Vic } from '../config/vic';
import {
  StateInComePopulationDatum,
  stateIncomePopulationData,
} from '../testing/stubs/data/states_population_income';

const margin = { top: 36, right: 36, bottom: 36, left: 36 };
const chartHeight = 400;
const chartWidth = 600;

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
// Geogrpahies component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-geographies',
  template: `
    <vic-map-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
    >
      <svg:g
        vic-data-marks-geographies
        svg-elements
        [config]="geographiesConfig"
      >
        <vic-html-tooltip
          [config]="tooltipConfig$ | async"
          [template]="htmlTooltip"
          (backdropClick)="onBackdropClick()"
        ></vic-html-tooltip>
      </svg:g>
    </vic-map-chart>
    <ng-template #htmlTooltip>
      <div
        [style.--color]="(tooltipData$ | async).color"
        class="tooltip-container"
      >
        <p class="tooltip-label geography">
          {{ (tooltipData$ | async).geography }}
        </p>
        <div class="values-container">
          <p class="tooltip-label x">
            <span class="value-label">Income</span>
            {{ (tooltipData$ | async).attributeValue }}
          </p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [],
})
class TestGeographiesComponent {
  @Input() geographiesConfig: VicGeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
}

const mountGeographiesComponent = (
  geographiesConfig: VicGeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >
): void => {
  const declarations = [TestGeographiesComponent];
  const imports = [
    VicMapChartModule,
    VicGeographiesModule,
    VicHtmlTooltipModule,
  ];

  cy.mount(TestGeographiesComponent, {
    declarations,
    imports,
    componentProperties: {
      geographiesConfig: geographiesConfig,
    },
  });
};

// ***********************************************************
// Drawing the map
// ***********************************************************
describe('drawing the geography paths', () => {
  let geographiesConfig: VicGeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  describe('layers: dataLayer: 0, noDataLayers: 1', () => {
    it('it draws a map with one geography per geography in geojson', () => {
      cy.fixture('usMap.json').then((response) => {
        const usMap: TestUsMapTopology = response;
        const usBoundary = topojson.feature(
          usMap,
          usMap.objects.country
        ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
        const states = topojson.feature(
          usMap,
          usMap.objects.states
        ) as FeatureCollection<
          MultiPolygon | Polygon,
          TestMapGeometryProperties
        >;
        geographiesConfig = Vic.geographies<
          StateInComePopulationDatum,
          TestMapGeometryProperties
        >({
          boundary: usBoundary,
          featureIndexAccessor: (d) => d.properties.name,
          noDataLayers: [
            Vic.geographiesNoDataLayer<TestMapGeometryProperties>({
              geographies: states.features,
              strokeColor: 'black',
              strokeWidth: '1',
            }),
          ],
        });
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geography-g path').then((paths) => {
          expect(paths).to.have.length(states.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('black');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
      });
    });
  });
  describe('layers: dataLayer: 0, noDataLayers: 0', () => {
    it('it draws a map with one geography per geography in geojson', () => {
      cy.fixture('usMap.json').then((response) => {
        const usMap: TestUsMapTopology = response;
        const usBoundary = topojson.feature(
          usMap,
          usMap.objects.country
        ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
        const states = topojson.feature(
          usMap,
          usMap.objects.states
        ) as FeatureCollection<
          MultiPolygon | Polygon,
          TestMapGeometryProperties
        >;
        geographiesConfig = Vic.geographies<
          StateInComePopulationDatum,
          TestMapGeometryProperties
        >({
          boundary: usBoundary,
          featureIndexAccessor: (d) => d.properties.name,
          dataLayer: Vic.geographiesDataLayer<
            StateInComePopulationDatum,
            TestMapGeometryProperties
          >({
            data: stateIncomePopulationData,
            geographies: states.features,
            geographyIndexAccessor: (d) => d.state,
            attributeDimension:
              Vic.geographiesDataDimensionNoBins<StateInComePopulationDatum>({
                valueAccessor: (d) => d.income,
              }),
            strokeColor: 'black',
            strokeWidth: '1',
          }),
        });
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geography-g path').then((paths) => {
          expect(paths).to.have.length(states.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('black');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
      });
    });
  });
});
