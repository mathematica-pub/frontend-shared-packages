/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { color } from 'd3';
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
  VicGeographiesConfigBuilder,
  VicGeographiesModule,
  VicMapChartModule,
} from '../../../../../../../public-api';
import {
  StateInComePopulationDatum,
  stateIncomePopulationData,
} from '../../../../../../testing/stubs/data/states_population_income';
import { GeographiesConfig } from '../../../../geographies-config';

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
// Geographies component set up
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
        [vicGeographiesHoverActions]="hoverActions"
        (vicGeographiesHoverOutput)="updateTooltipForNewOutput($event)"
      ></svg:g>
    </vic-map-chart>
  `,
  styles: [],
})
class TestGeographiesComponent {
  @Input() geographiesConfig: GeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
}

const mountGeographiesComponent = (
  geographiesConfig: GeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >
): void => {
  const declarations = [TestGeographiesComponent];
  const imports = [VicMapChartModule, VicGeographiesModule];

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
describe('the Equal Value Ranges Bins Attribute Data dimension', () => {
  let geographiesConfig: GeographiesConfig<
    StateInComePopulationDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  it('Uses dimension defaults and creates bins in the data and colors values accordingly with default colors', () => {
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
        StateInComePopulationDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .createAttributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .createEqualValueRangesBinsDimension((bins) =>
              bins.valueAccessor((d) => d.income)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const scale =
        geographiesConfig.attributeDataLayer.attributeDimension.getScale();
      const ranges = {
        white: scale.invertExtent('white'),
        pink: scale.invertExtent('pink'),
        red: scale.invertExtent('red'),
      };
      const whiteRange = ranges.white[1] - ranges.white[0];
      const pinkRange = ranges.pink[1] - ranges.pink[0];
      const redRange = ranges.red[1] - ranges.red[0];
      expect(whiteRange).to.be.closeTo(pinkRange, 1);
      expect(pinkRange).to.be.closeTo(redRange, 1);
      cy.get('.vic-geography-g path').then((states) => {
        states.each((_, state) => {
          const fill = state.getAttribute('fill');
          const datum = attributeData.find(
            (d) => d.state === state.classList[0].split('-').join(' ')
          );
          if (datum) {
            if (datum.income < ranges.white[1]) {
              expect(fill).to.equal('white');
            } else if (datum.income < ranges.pink[1]) {
              expect(fill).to.equal('pink');
            } else {
              expect(fill).to.equal('red');
            }
          }
        });
      });
    });
  });

  it('colors values lower than user-provided domain with first bin color and values higher than user-provided domain with last bin color', () => {
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
        StateInComePopulationDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .createAttributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .createEqualValueRangesBinsDimension((bins) =>
              bins.valueAccessor((d) => d.income).domain([50000, 80000])
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      cy.get('.vic-geography-g path').then((states) => {
        states.each((_, state) => {
          const fill = state.getAttribute('fill');
          const datum = attributeData.find(
            (d) => d.state === state.classList[0].split('-').join(' ')
          );
          if (datum) {
            if (datum.income < 50000) {
              expect(fill).to.equal('white');
            }
            if (datum.income > 80000) {
              expect(fill).to.equal('red');
            }
          }
        });
      });
    });
  });

  it('colors the map with the number of bins specified in numBins for features with attribute data and a null color for features without attribute data even if the range provides fewer colors', () => {
    cy.fixture('usMap.json').then((response) => {
      const numBins = 6;
      const nullColor = 'navajowhite';
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
        StateInComePopulationDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .createAttributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .createEqualValueRangesBinsDimension((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .numBins(numBins)
                .nullColor(nullColor)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const colors = [];
      cy.get('.vic-geography-g path').then((states) => {
        states.each((_, state) => {
          const fill = state.getAttribute('fill');
          if (!colors.includes(fill)) {
            colors.push(fill);
          }
        });
        expect(colors.length).to.equal(numBins + 1);
        expect(colors).to.include(nullColor);
      });
    });
  });

  it('colors the map with the first numBins colors in the range for features with attribute data and the nullColor for features without attribute data if numBins is a smaller number than the length of the range', () => {
    cy.fixture('usMap.json').then((response) => {
      const numBins = 2;
      const nullColor = 'navajowhite';
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
        StateInComePopulationDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .createAttributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .createEqualValueRangesBinsDimension((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .numBins(numBins)
                .nullColor(nullColor)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const colors = [];
      cy.get('.vic-geography-g path').then((states) => {
        states.each((_, state) => {
          const fill = state.getAttribute('fill');
          if (!colors.includes(fill)) {
            colors.push(fill);
          }
        });
        expect(colors.length).to.equal(numBins + 1);
        expect(colors).to.include(nullColor);
        expect(colors).to.include(color('white').formatRgb());
        expect(colors).to.include(color('pink').formatRgb());
      });
    });
  });
});
