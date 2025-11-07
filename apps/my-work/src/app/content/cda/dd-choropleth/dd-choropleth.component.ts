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
import { filter, map, Observable, shareReplay } from 'rxjs';
import * as topojson from 'topojson-client';
import { Topology } from 'topojson-specification';
import { DataService } from '../../../core/services/data.service';
import { caDataFolder } from '../../ca/data-paths.constants';

interface CountyDatum {
  county: string;
  value: number;
}

interface ViewModel {
  chartConfig: ChartConfig;
  geographiesConfig: GeographiesConfig<CountyDatum, MapGeometryProperties>;
}

type MapTopology = Topology<MapObjects>;

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
  templateUrl: 'dd-choropleth.component.html',
  styleUrl: './dd-choropleth.component.scss',
  providers: [VicChartConfigBuilder, VicGeographiesConfigBuilder],
  encapsulation: ViewEncapsulation.None,
})
export class DdChoroplethComponent implements OnInit {
  data$: Observable<any[]>;
  dataPath = 'content/data/cda/task_697_normalized_dd_count.csv';
  filters = {
    measureCodes: [],
    lobs: [],
    stratVals: [],
  };
  filterTypes = ['measureCode', 'lob', 'stratVal'];
  vm$: Observable<ViewModel>;
  featureIndexAccessor = (d: GeographiesFeature<MapGeometryProperties>) =>
    d.properties.name;
  map: Topology<MapObjects>;
  counties: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  width = 550;
  height = 650;
  margin: ElementSpacing = { top: 0, right: 0, bottom: 20, left: 0 };
  outlineColor = 'white';
  colors = {
    min: '#ffffff',
    max: '#046b5c',
    noData: '#d9d9d9',
    stroke: this.outlineColor,
    outline: this.outlineColor,
  };
  legendHeight = 20;
  legendWidth = 200;

  constructor(
    private chart: VicChartConfigBuilder,
    private geographies: VicGeographiesConfigBuilder<
      CountyDatum,
      MapGeometryProperties
    >,
    private assets: AdkAssetsService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.setData();
    this.setMapObjects();
    this.setVm();
  }

  setData(): void {
    this.data$ = this.dataService.getDataFile(this.dataPath).pipe(
      filter((data) => data.length > 0),
      map((data) => this.getTransformedData(data))
    );
  }

  getTransformedData(data: CountyDatum[]): CountyDatum[] {
    const transformed: CountyDatum[] = data.map((x: any) => {
      const obj: CountyDatum = {
        county: x.COUNTY,
        value:
          x['Normalized DD Count'] && !isNaN(x['Normalized DD Count'])
            ? +x['Normalized DD Count']
            : null,
      };
      return obj;
    });
    return transformed;
  }

  setVm(): void {
    this.vm$ = this.data$.pipe(
      map((data) => ({
        chartConfig: this.getChartConfig(),
        geographiesConfig: this.getPrimaryMarksConfig(data as CountyDatum[]),
      })),
      shareReplay(1)
    );
  }

  getChartConfig(): ChartConfig {
    return this.chart
      .margin(this.margin)
      .maxHeight(this.height)
      .maxWidth(this.width)
      .scalingStrategy('fixed')
      .fixedHeight(true)
      .getConfig();
  }

  getPrimaryMarksConfig(
    data: CountyDatum[]
  ): GeographiesConfig<CountyDatum, MapGeometryProperties> {
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
      .stroke((stroke) => stroke.color(this.colors.stroke).width(0.5))
      .fill((dimension) =>
        dimension.valueAccessor((d) => d.properties.name).range(['none'])
      );
  }

  getDataLayer(
    data: CountyDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      CountyDatum,
      MapGeometryProperties
    >
  ): GeographiesAttributeDataLayerBuilder<CountyDatum, MapGeometryProperties> {
    // const absoluteMax = max(data, (d) => Math.abs(d.value));
    // const maxVals = [absoluteMax * 0.333, absoluteMax * 0.666, absoluteMax];
    // const breakValues = [...maxVals.map((d) => d * -1), 0, ...maxVals].sort(
    //   ascending
    // );
    return (
      layer
        .data(data)
        .geographies(this.getDataGeographiesFeatures(data))
        .geographyIndexAccessor((d) => d.county)
        //   .customBreaksBins((dimension) =>
        //     dimension
        //       .valueAccessor((d) => d.value)
        //       .breakValues(breakValues)
        //       .formatSpecifier('+,.2f')
        //       .range(this.colors.diverging)
        //       .nullColor(this.colors.noData)
        //   );
        .noBins((dimension) =>
          dimension
            .valueAccessor((d) => d.value)
            .formatSpecifier(',.0f')
            .range([this.colors.min, this.colors.max])
            .domain([0, 3000])
            .nullColor(this.colors.noData)
        )
    );
  }

  getDataGeographiesFeatures(data: CountyDatum[]): any {
    const countiesInData = data.map((x) => x.county);
    return this.counties.features.filter((x) =>
      countiesInData.includes(x.properties.name)
    );
  }

  setMapObjects(): void {
    this.getMap().subscribe((map) => {
      this.map = map;
      this.setCountiesGeoJson();
    });
  }

  getMap(): Observable<MapTopology> {
    return this.assets
      .getAsset(`${caDataFolder}caCountiesTopo.json`, AdkAssetResponse.Json)
      .pipe(map((response) => response as MapTopology));
  }

  setCountiesGeoJson(): void {
    this.counties = topojson.feature(
      this.map,
      this.map.objects['subunits']
    ) as FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  }
}
