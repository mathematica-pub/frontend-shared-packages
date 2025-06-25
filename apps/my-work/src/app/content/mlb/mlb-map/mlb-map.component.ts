/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdkAssetResponse, AdkAssetsService } from '@hsi/app-dev-kit';
import {
  ChartConfig,
  ElementSpacing,
  GeographiesAttributeDataLayerBuilder,
  GeographiesConfig,
  GeographiesFeature,
  GeographiesGeojsonPropertiesLayerBuilder,
  VicChartConfigBuilder,
  VicChartModule,
  VicGeographiesConfigBuilder,
  VicGeographiesModule,
  VicMapLegendModule,
} from '@hsi/viz-components';
import {
  MapGeometryProperties,
  MapObjects,
} from 'apps/demo-app/src/app/core/services/basemap';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { geoMercator } from 'd3';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { map, Observable, shareReplay } from 'rxjs';
import * as topojson from 'topojson-client';
import { Topology } from 'topojson-specification';
import { DataService } from '../../../core/services/data.service';
import { mlbDataPath } from '../../ca-access/data-paths.constants';
import { MlbChartComponent } from '../mlb-chart.component';
import { MlbDatum } from '../mlb-stacked-bars.component';

export interface MlbCsaDatum extends MlbDatum {
  county: string;
  range: number;
}

interface ViewModel {
  chartConfig: ChartConfig;
  geographiesConfig: GeographiesConfig<MlbCsaDatum, MapGeometryProperties>;
}

type CaMapTopology = Topology<MapObjects>;

@Component({
  selector: 'app-mlb-map',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    VicChartModule,
    VicGeographiesModule,
    VicMapLegendModule,
  ],
  templateUrl: 'mlb-map.component.html',
  styleUrl: './mlb-map.component.scss',
  providers: [VicChartConfigBuilder, VicGeographiesConfigBuilder],
  encapsulation: ViewEncapsulation.None,
})
export class MlbMapComponent extends MlbChartComponent implements OnInit {
  override mlbDataPath = mlbDataPath.csa;
  override filters = {
    measureCodes: [],
    stratVals: [],
  };
  override filterTypes = ['measureCode', 'stratVal'];
  vm$: Observable<ViewModel>;
  featureIndexAccessor = (d: GeographiesFeature<MapGeometryProperties>) =>
    d.properties.name;
  map: CaMapTopology;
  //   ca: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  counties: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  width = 600;
  height = 800;
  margin: ElementSpacing = { top: 0, right: 0, bottom: 0, left: 0 };
  colors = {
    min: 'white',
    max: '#d62728',
    highlight: '#1f77b4',
    noData: '#d9d9d9',
    stroke: '#888',
    outline: '#000000',
  };

  constructor(
    dataService: DataService,
    private chart: VicChartConfigBuilder,
    private geographies: VicGeographiesConfigBuilder<
      MlbCsaDatum,
      MapGeometryProperties
    >,
    private assets: AdkAssetsService
  ) {
    super(dataService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.setMapObjects();
    this.setVm();
  }

  override getTransformedData(data: MlbCsaDatum[]): MlbCsaDatum[] {
    const transformed: MlbCsaDatum[] = data.map((x: any) => {
      const obj: MlbCsaDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        units: x.Units,
        county: x.County,
        directionality: x.Directionality,
        stratVal: x.StratVal,
        lob: x.LOB,
        comparison: x.Comparison === 'TRUE',
        value: null, // null to avoid bars
        average: x.Value && !isNaN(x.Value) ? +x.Value : null,
        range: x.Range && !isNaN(x.Range) ? +x.Range : null,
      };
      return obj;
    });
    return transformed;
  }

  setVm(): void {
    this.vm$ = this.filteredData$.pipe(
      map((data) => ({
        chartConfig: this.getChartConfig(),
        // TODO: is this conversion of datum best?
        geographiesConfig: this.getPrimaryMarksConfig(data as MlbCsaDatum[]),
      })),
      shareReplay(1)
    );
  }

  getChartConfig(): ChartConfig {
    return this.chart
      .margin(this.margin)
      .height(this.height)
      .width(this.width)
      .getConfig();
  }

  getPrimaryMarksConfig(
    data: MlbCsaDatum[]
  ): GeographiesConfig<MlbCsaDatum, MapGeometryProperties> {
    const config = this.geographies
      .boundary(this.counties)
      .featureIndexAccessor(this.featureIndexAccessor)
      .geojsonPropertiesLayer((layer) => this.getMapOutlinesConfig(layer))
      .attributeDataLayer((layer) => this.getDataLayer(data, layer))
      .projection(geoMercator())
      .getConfig();
    return config;
  }

  getMapOutlinesConfig(
    layer: GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties>
  ): GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties> {
    return layer
      .geographies(this.counties.features)
      .stroke((stroke) => stroke.color(this.colors.stroke).width(1))
      .fill((dimension) =>
        dimension.valueAccessor((d) => d.properties.name).range(['none'])
      );
  }

  getDataLayer(
    data: MlbCsaDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      MlbCsaDatum,
      MapGeometryProperties
    >
  ): GeographiesAttributeDataLayerBuilder<MlbCsaDatum, MapGeometryProperties> {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.county)
      .noBins((dimension) =>
        dimension
          .valueAccessor((d) => d.value)
          .formatSpecifier(',.2f')
          .range([this.colors.min, this.colors.max])
      );
  }

  getDataGeographiesFeatures(data: MlbCsaDatum[]): any {
    const countiesInData = data.map((x) => x.county);
    return this.counties.features.filter((x) =>
      countiesInData.includes(x.properties.name)
    );
  }

  setMapObjects(): void {
    this.getMap().subscribe((map) => {
      this.map = map;
      //   this.setCaGeoJson();
      this.setCountiesGeoJson();
    });
  }

  getMap(): Observable<CaMapTopology> {
    return this.assets
      .getAsset(
        'content/data/caCountiesTopoSimple.json',
        //   'content/data/California_Counties.geojson',
        AdkAssetResponse.Json
      )
      .pipe(map((response) => response as CaMapTopology));
  }

  //   setCaGeoJson(): void {
  //     this.ca = topojson.feature(
  //       this.map,
  //       //   this.map.objects.country
  //       // TODO: this should be the CA state outline, but is counties
  //       this.map.objects['subunits']
  //     ) as FeatureCollection<MultiPolygon, MapGeometryProperties>;
  //   }

  setCountiesGeoJson(): void {
    this.counties = topojson.feature(
      this.map,
      this.map.objects['subunits']
    ) as FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  }
}
