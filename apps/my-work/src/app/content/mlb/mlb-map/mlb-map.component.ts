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
import { ascending, geoMercator, max } from 'd3';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { map, Observable, shareReplay } from 'rxjs';
import * as topojson from 'topojson-client';
import { Topology } from 'topojson-specification';
import { DataService } from '../../../core/services/data.service';
import {
  caDataFolder,
  mlbDataPath,
} from '../../ca-access/data-paths.constants';
import { MlbChartComponent } from '../mlb-chart.component';
import { MlbDatum } from '../mlb-stacked-bars.component';

export interface MlbCsaDatum extends MlbDatum {
  county: string;
  range: number;
}

interface ViewModel {
  chartConfig: ChartConfig;
  geographiesConfig: GeographiesConfig<MlbCsaDatum, MapGeometryProperties>;
  isNoData: boolean;
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
  override mlbDataPath = mlbDataPath.lob;
  override filters = {
    measureCodes: [],
    lobs: [],
    stratVals: [],
  };
  override filterTypes = ['measureCode', 'lob', 'stratVal'];
  vm$: Observable<ViewModel>;
  featureIndexAccessor = (d: GeographiesFeature<MapGeometryProperties>) =>
    d.properties.name;
  map: CaMapTopology;
  counties: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  width = 550;
  height = 650;
  margin: ElementSpacing = { top: 0, right: 0, bottom: 20, left: 0 };
  outlineColor = 'white';
  colors = {
    min: '#eff3ff',
    max: '#084594',
    diverging: [
      '#8c510a',
      '#d8b365',
      '#f6e8c3',
      '#c7eae5',
      '#5ab4ac',
      '#01665e',
    ],
    noData: '#d9d9d9',
    stroke: this.outlineColor,
    outline: this.outlineColor,
  };
  legendHeight = 20;
  legendWidth = 400;

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
        value: x.Value && !isNaN(x.Value) ? +x.Value : null,
        average: null,
        range: x.Range && !isNaN(x.Range) ? +x.Range : null,
      };
      return obj;
    });
    return transformed;
  }

  override isComparison(d: MlbDatum): boolean {
    return d.comparison === true;
  }

  setVm(): void {
    this.vm$ = this.filteredData$.pipe(
      map((data) => ({
        chartConfig: this.getChartConfig(),
        geographiesConfig: this.getPrimaryMarksConfig(data as MlbCsaDatum[]),
        isNoData: data.some((d: MlbDatum) => d.value === null),
      })),
      shareReplay(1)
    );
  }

  getChartConfig(): ChartConfig {
    return this.chart
      .margin(this.margin)
      .height(this.height)
      .width(this.width)
      .resize({ useViewbox: false, width: false, height: false })
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
      .stroke((stroke) => stroke.color(this.colors.stroke).width(0.5))
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
    const absoluteMax = max(data, (d) => Math.abs(d.value));
    const maxVals = [absoluteMax * 0.333, absoluteMax * 0.666, absoluteMax];
    const breakValues = [...maxVals.map((d) => d * -1), 0, ...maxVals].sort(
      ascending
    );
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.county)
      .customBreaksBins((dimension) =>
        dimension
          .valueAccessor((d) => d.value)
          .breakValues(breakValues)
          .formatSpecifier('+,.2f')
          .range(this.colors.diverging)
          .nullColor(this.colors.noData)
      );
    // .noBins((dimension) =>
    //   dimension
    //     .valueAccessor((d) => d.value)
    //     .formatSpecifier(',.2f')
    //     .range([this.colors.min, this.colors.max])
    //     .nullColor(this.colors.noData)
    // );
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
      this.setCountiesGeoJson();
    });
  }

  getMap(): Observable<CaMapTopology> {
    return this.assets
      .getAsset(`${caDataFolder}caCountiesTopo.json`, AdkAssetResponse.Json)
      .pipe(map((response) => response as CaMapTopology));
  }

  setCountiesGeoJson(): void {
    this.counties = topojson.feature(
      this.map,
      this.map.objects['subunits']
    ) as FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  }
}
