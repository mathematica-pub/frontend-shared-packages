import { Component, Input } from '@angular/core';
import 'cypress-real-events';
import { ascending, extent, mean, scaleLinear } from 'd3';
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import * as topojson from 'topojson-client';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';
import {
  GeographiesHoverDirective,
  GeographiesHoverEmitTooltipData,
  VicGeographiesConfigBuilder,
  VicGeographiesModule,
  VicHtmlTooltipModule,
  VicMapChartModule,
} from '../../public-api';
import { EventAction } from '../events/action';
import {
  StateIncomePopulationYearDatum,
  stateIncomePopulationYearData,
} from '../testing/data/state-population-income-year-data';
import { VicHtmlTooltipConfigBuilder } from '../tooltips/html-tooltip/config/html-tooltip-builder';
import { HtmlTooltipConfig } from '../tooltips/html-tooltip/config/html-tooltip-config';
import { GeographiesConfig } from './config/geographies-config';
import { GeographiesEventOutput } from './events/geographies-event-output';
interface StateIncomeDatum {
  state: string;
  population: number;
  income: number;
  year: number;
}

const margin = { top: 40, right: 40, bottom: 0, left: 40 };
const chartHeight = 400;
const chartWidth = 600;
const attributeData = stateIncomePopulationYearData
  .filter((x) => x.year === 2020)
  .filter((x) => x.state !== 'Puerto Rico');
const tooltipYOffset = 40;

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
        vic-primary-marks-geographies
        svg-elements
        [config]="geographiesConfig"
        [vicGeographiesHoverActions]="hoverActions"
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
  styles: ['.tooltip-container { font-size: 12px; }'],
})
class TestGeographiesComponent {
  @Input() geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<GeographiesEventOutput<StateIncomeDatum>> =
    new BehaviorSubject<GeographiesEventOutput<StateIncomeDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: EventAction<
    GeographiesHoverDirective<StateIncomeDatum, TestMapGeometryProperties>
  >[] = [
    new GeographiesHoverEmitTooltipData<
      StateIncomeDatum,
      TestMapGeometryProperties
    >(),
  ];

  updateTooltipForNewOutput(
    data: GeographiesEventOutput<StateIncomeDatum>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: GeographiesEventOutput<StateIncomeDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: GeographiesEventOutput<StateIncomeDatum>): void {
    const config = new VicHtmlTooltipConfigBuilder()
      .size((size) => size.minWidth(80))
      .geographiesPosition(data?.origin, [
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

const mountGeographiesComponent = (
  geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
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
  let geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  describe('layers: attributeDataLayer: true, geojsonPropertiesLayers: 0', () => {
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
                  .range(['white', 'orangered'])
              )
              .stroke((stroke) => stroke.color('black').width(1))
          )
          .getConfig();
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geographies-group path').then((paths) => {
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

  describe('layers: attributeDataLayer: false, geojsonPropertiesLayers: 2', () => {
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
        geographiesConfig = new VicGeographiesConfigBuilder<
          StateIncomePopulationYearDatum,
          TestMapGeometryProperties
        >()
          .boundary(usBoundary)
          .featureIndexAccessor((d) => d.properties.name)
          .geojsonPropertiesLayer((layer) =>
            layer
              .geographies(states.features)
              .class((d) => d.name.split(' ').join('-'))
              .stroke((stroke) => stroke.color('black').width(1))
          )
          .geojsonPropertiesLayer((layer) =>
            layer
              .geographies(usBoundary.features)
              .class((d) => d.name.split(' ').join('-'))
              .stroke((stroke) => stroke.color('red').width(1))
          )
          .getConfig();
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geographies-group path').should(
          'have.length',
          states.features.length + usBoundary.features.length
        );
        cy.get('.vic-geographies-layer-0 path').then((paths) => {
          expect(paths).to.have.length(states.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('black');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
        cy.get('.vic-geographies-layer-1 path').then((paths) => {
          expect(paths).to.have.length(usBoundary.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('red');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
      });
    });
  });

  describe('layers: attributeDataLayer: true, geojsonPropertiesLayers: 1', () => {
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
                  .range(['white', 'orangered'])
              )
              .stroke((stroke) => stroke.color('black').width(1))
          )
          .geojsonPropertiesLayer((layer) =>
            layer
              .geographies(usBoundary.features)
              .stroke((stroke) => stroke.color('red').width(1))
          )
          .getConfig();
        mountGeographiesComponent(geographiesConfig);
        cy.get(
          '.vic-geographies-layer.vic-geographies-attribute-data-layer path'
        ).then((paths) => {
          expect(paths).to.have.length(states.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('black');
            expect(path.attr('stroke-width')).to.eq('1');
            expect(path.attr('fill')).to.not.eq('none');
          });
        });
        cy.get('.vic-geographies-layer-1 path').then((paths) => {
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
// Tests of coloring by attribute data values are in individual attribute dimension tests
// ***********************************************************

// ***********************************************************
// Tests of coloring geojsonProperties with categorical dimension
// ***********************************************************
// ***********************************************************
// Drawing the map
// ***********************************************************
describe('drawing the geography paths for various layers', () => {
  let geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  describe('layers: attributeDataLayer: false, geojsonPropertiesLayers: 2', () => {
    it('it colors geographies in a geoJsonProperties layer by value returned from valueAccessor', () => {
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
        // Colors state by the length of the name
        const stateNames = states.features
          .map((x) => x.properties.name)
          .filter(
            (x) =>
              !x.includes('District') &&
              !x.includes('Islands') &&
              !x.includes('Samoa')
          )
          .sort((a, b) => ascending(a.length, b.length));
        const stateNamesScale = scaleLinear<string>()
          .domain(extent(stateNames.map((x) => x.length)))
          .range(['white', 'magenta']);
        geographiesConfig = new VicGeographiesConfigBuilder<
          StateIncomePopulationYearDatum,
          TestMapGeometryProperties
        >()
          .boundary(usBoundary)
          .featureIndexAccessor((d) => d.properties.name)
          .geojsonPropertiesLayer((layer) =>
            layer
              .geographies(states.features)
              .class((d) => d.name.split(' ').join('-'))
              .stroke((stroke) => stroke.color('black').width(1))
              .fill((dimension) =>
                dimension
                  .scale((stateNameLength) =>
                    stateNamesScale(+stateNameLength.length)
                  )
                  .valueAccessor((d) => d.properties.name.length.toString())
              )
          )
          .geojsonPropertiesLayer((layer) =>
            layer
              .geographies(usBoundary.features)
              .class((d) => d.name.split(' ').join('-'))
              .stroke((stroke) => stroke.color('blue').width(1))
          )
          .getConfig();
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geographies-group path').should(
          'have.length',
          states.features.length + usBoundary.features.length
        );
        cy.get('.vic-geographies-layer-0 path').then((paths) => {
          expect(paths).to.have.length(states.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('black');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
        cy.get('.vic-geographies-layer-1 path').then((paths) => {
          expect(paths).to.have.length(usBoundary.features.length);
          cy.wrap(paths).each((path) => {
            expect(path.attr('stroke')).to.eq('blue');
            expect(path.attr('stroke-width')).to.eq('1');
          });
        });
        const colors = [255];
        stateNames.forEach((d, i) => {
          const state = d.replace(/\s/g, '-');
          cy.get(`.vic-geographies-group.${state} path`).then((path) => {
            const color = parseInt(
              path.attr('fill').split('(')[1].split(',')[1]
            );
            expect(color).to.be.lte(colors[i]);
            colors.push(color);
          });
        });
      });
    });
  });
});

// ***********************************************************
// Test geography labels
// ***********************************************************
describe('drawing the geography labels various layers', () => {
  let geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  describe('layers: attributeDataLayer: true, geojsonPropertiesLayers: 1', () => {
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
              .geographies(
                states.features.filter(
                  (x) => x.properties.name[x.properties.name.length - 1] !== 'a'
                )
              )
              .geographyIndexAccessor((d) => d.state)
              .noBins((dimension) =>
                dimension
                  .valueAccessor((d) => d.income)
                  .range(['white', 'orangered'])
              )
              .stroke((stroke) => stroke.color('black').width(1))
              .labels((labels) =>
                labels.valueAccessor((d) => d.properties.id).color('black')
              )
          )
          .geojsonPropertiesLayer((layer) =>
            layer
              .geographies(
                states.features.filter(
                  (x) => x.properties.name[x.properties.name.length - 1] === 'a'
                )
              )
              .class((d) => d.name.split(' ').join('-'))
              .fill((dimension) => dimension.range(['darkblue']))
              .stroke((stroke) => stroke.width(1))
              .labels((labels) =>
                labels
                  .valueAccessor((d) => `${d.properties.id}*`)
                  .color('chartreuse')
              )
          )
          .getConfig();
        mountGeographiesComponent(geographiesConfig);
        cy.get('.vic-geographies-group').then((groups) => {
          expect(groups).to.have.length(states.features.length);
          cy.wrap(groups)
            .find('text')
            .then((labels) => {
              expect(labels).to.have.length(states.features.length);
            });
        });
        cy.get(
          '.vic-geographies-attribute-data-layer .vic-geographies-group'
        ).then((groups) => {
          cy.wrap(groups).each((group) => {
            const label = group.find('text');
            expect(label.text().length).to.equal(2);
            expect(label.attr('fill')).to.eq('black');
          });
        });
        cy.get(
          '.vic-geographies-geojson-properties-layer .vic-geographies-group'
        ).then((groups) => {
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

// ***********************************************************
// Tests of tooltips
// ***********************************************************
const mountGeographiesForTooltipTests = (json: TestUsMapTopology) => {
  const usMap: TestUsMapTopology = json;
  const usBoundary = topojson.feature(
    usMap,
    usMap.objects.country
  ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
  const states = topojson.feature(
    usMap,
    usMap.objects.states
  ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
  const geographiesConfig = new VicGeographiesConfigBuilder<
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
          dimension.valueAccessor((d) => d.income).range(['white', 'orangered'])
        )
        .stroke((stroke) => stroke.color('black').width(1))
    )
    .getConfig();
  mountGeographiesComponent(geographiesConfig);
};
describe('displays tooltips for correct data per hover position', () => {
  // The "center" of some selected state elements that gets hovered is technically not within the state
  // Excluding these exceptions from the test
  const statesWithCenterOutsideOfPath = [
    'District of Columbia',
    'Florida',
    'Hawaii',
    'Maryland',
    'Michigan',
    'New Jersey',
  ];
  attributeData
    .filter((d) => !statesWithCenterOutsideOfPath.includes(d.state))
    .forEach((stateDatum) => {
      it(`State: ${stateDatum.state}`, () => {
        cy.fixture('usMap.json').then((response) => {
          mountGeographiesForTooltipTests(response);
          cy.get(
            `.vic-geographies-group.${stateDatum.state.split(' ').join('-')}`
          ).realHover();
          cy.get('.vic-html-tooltip-overlay').should('be.visible');
          cy.get('.vic-html-tooltip-overlay p')
            .eq(0)
            .should('contain.text', stateDatum.state);
          cy.get('.vic-html-tooltip-overlay p')
            .eq(1)
            .should('contain.text', `Income ${stateDatum.income}`);
          cy.get('.vic-html-tooltip-overlay').then(($el) => {
            const tooltipBox = $el[0].getBoundingClientRect();
            cy.get(
              `.vic-geographies-group.${stateDatum.state.split(' ').join('-')}`
            ).then(($stateEl) => {
              const stateBox = $stateEl[0].getBoundingClientRect();
              expect(mean([tooltipBox.left, tooltipBox.right])).to.be.closeTo(
                mean([stateBox.left, stateBox.right]),
                1
              );
              expect(tooltipBox.bottom + tooltipYOffset).to.be.closeTo(
                mean([stateBox.top, stateBox.bottom]),
                20
              );
            });
          });
        });
      });
    });
});
