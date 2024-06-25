import { Component, Input } from '@angular/core';
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { StateIncomeDatum } from 'projects/demo-app/src/app/core/models/data';
import { BehaviorSubject } from 'rxjs';
import * as topojson from 'topojson-client';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';
import {
  VicGeographiesConfig,
  VicGeographiesEventOutput,
  VicGeographiesModule,
  VicHtmlTooltipConfig,
  VicHtmlTooltipModule,
  VicHtmlTooltipOffsetFromOriginPosition,
  VicMapChartModule,
} from '../../public-api';
import { Vic } from '../config/vic';
import {
  StateInComePopulationDatum,
  stateIncomePopulationData,
} from '../testing/stubs/data/states_population_income';

const statesWithoutLabels = [
  'NH',
  'VT',
  'MA',
  'RI',
  'CT',
  'NJ',
  'MD',
  'DE',
  'DC',
  'PR',
];
const margin = { top: 36, right: 36, bottom: 36, left: 36 };
const chartHeight = 400;
const chartWidth = 600;
const attributeData = stateIncomePopulationData
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
        [vicGeographiesHoverEffects]="hoverEffects"
        (vicGeographiesHoverOutput)="updateTooltipForNewOutput($event)"
      >
        <vic-html-tooltip
          [config]="tooltipConfig$ | async"
          [template]="htmlTooltip"
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
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<VicGeographiesEventOutput<StateIncomeDatum>> =
    new BehaviorSubject<VicGeographiesEventOutput<StateIncomeDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();

  updateTooltipForNewOutput(
    data: VicGeographiesEventOutput<StateIncomeDatum>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: VicGeographiesEventOutput<StateIncomeDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: VicGeographiesEventOutput<StateIncomeDatum>): void {
    const config = new VicHtmlTooltipConfig();
    config.size.minWidth = 130;
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY;
      config.show = true;
    } else {
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }
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
describe('drawing the geography paths for various layers', () => {
  let geographiesConfig: VicGeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  describe('layers: dataLayer: true, noDataLayers: 0', () => {
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
            data: attributeData,
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
            expect(path.attr('fill')).to.not.eq('none');
          });
        });
      });
    });
  });

  describe('layers: dataLayer: false, noDataLayers: 2', () => {
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
            Vic.geographiesNoDataLayer<TestMapGeometryProperties>({
              geographies: usBoundary.features,
              strokeColor: 'red',
              strokeWidth: '1',
            }),
          ],
        });
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geography-g path').should(
          'have.length',
          states.features.length + usBoundary.features.length
        );
        cy.get('.layer-0 path').then((paths) => {
          expect(paths).to.have.length(states.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('black');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
        cy.get('.layer-1 path').then((paths) => {
          expect(paths).to.have.length(usBoundary.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('red');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
      });
    });
  });

  describe('layers: dataLayer: true, noDataLayers: 1', () => {
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
            data: attributeData,
            geographies: states.features,
            geographyIndexAccessor: (d) => d.state,
            attributeDimension:
              Vic.geographiesDataDimensionNoBins<StateInComePopulationDatum>({
                valueAccessor: (d) => d.income,
              }),
            strokeColor: 'black',
            strokeWidth: '1',
          }),
          noDataLayers: [
            Vic.geographiesNoDataLayer<TestMapGeometryProperties>({
              geographies: usBoundary.features,
              strokeColor: 'red',
              strokeWidth: '1',
            }),
          ],
        });
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geographies-data-layer path').then((paths) => {
          expect(paths).to.have.length(states.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('black');
            expect(path.attr('stroke-width')).to.eq('1');
            expect(path.attr('fill')).to.not.eq('none');
          });
        });
        cy.get('.layer-1 path').then((paths) => {
          expect(paths).to.have.length(usBoundary.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('red');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
      });
    });
  });
});

// ***********************************************************
// Tests of coloring by data values are in individual attribute dimension tests
// ***********************************************************

// ***********************************************************
// Test geography labels
// ***********************************************************
describe('drawing the geography labels various layers', () => {
  let geographiesConfig: VicGeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  describe('layers: dataLayer: true, noDataLayers: 1', () => {
    it('it draws a map with labels on both data and non-data layers', () => {
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
            data: attributeData,
            geographies: states.features.filter(
              (x) => x.properties.name[x.properties.name.length - 1] !== 'a'
            ),
            geographyIndexAccessor: (d) => d.state,
            attributeDimension:
              Vic.geographiesDataDimensionNoBins<StateInComePopulationDatum>({
                valueAccessor: (d) => d.income,
                range: ['white', 'orangered'],
              }),
            strokeColor: 'black',
            strokeWidth: '1',
            class: 'test-data-layer',
            labels: Vic.geographiesLabels<
              StateInComePopulationDatum,
              TestMapGeometryProperties
            >({
              valueAccessor: (feature) => feature.properties.id,
              color: 'black',
            }),
          }),
          noDataLayers: [
            Vic.geographiesNoDataLayer<TestMapGeometryProperties>({
              geographies: states.features.filter(
                (x) => x.properties.name[x.properties.name.length - 1] === 'a'
              ),
              categorical: Vic.dimensionCategorical({
                range: ['darkblue'],
              }),
              class: 'test-no-data-layer',
              strokeWidth: '1',
              labels: Vic.geographiesLabels({
                valueAccessor: (feature) => `${feature.properties.id}*`,
                color: 'chartreuse',
              }),
            }),
          ],
        });
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geography-g').then((groups) => {
          expect(groups).to.have.length(states.features.length);
          cy.wrap(groups)
            .find('text')
            .then((labels) => {
              expect(labels).to.have.length(states.features.length);
            });
        });
        cy.get('.test-data-layer .vic-geography-g').then((groups) => {
          cy.wrap(groups).each((group) => {
            const label = group.find('text');
            expect(label.text().length).to.equal(2);
            expect(label.attr('fill')).to.eq('black');
          });
        });
        cy.get('.test-no-data-layer .vic-geography-g').then((groups) => {
          cy.wrap(groups).each((group) => {
            const label = group.find('text');
            expect(label.text().length).to.equal(3);
            expect(label.text()[2]).to.equal('*');
            expect(label.attr('fill')).to.eq('chartreuse');
          });
        });
      });
    });
  });
});
