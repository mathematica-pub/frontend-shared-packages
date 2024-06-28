import { Injectable } from '@angular/core';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { VicGeographiesGeojsonPropertiesLayer } from 'projects/viz-components/src/lib/geographies/config/layers/geojson-properties-layer';
import {
  Vic,
  VicGeographiesFeature,
} from 'projects/viz-components/src/public-api';
import * as topojson from 'topojson-client';
import { colors } from '../constants/colors.constants';
import { DataResource } from '../resources/data.resource';
import { MapGeometryProperties, UsMapTopology } from './basemap';

@Injectable({
  providedIn: 'root',
})
export class BasemapService {
  map: UsMapTopology;
  us: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  states: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  usOutlineConfig: VicGeographiesGeojsonPropertiesLayer<
    MapGeometryProperties,
    MultiPolygon | Polygon
  >;

  constructor(private data: DataResource) {}

  initMap(): void {
    this.setMapObjects();
  }

  setMapObjects(): void {
    this.data.getBasemap().subscribe((map) => {
      this.map = map;
      this.setUsGeoJson();
      this.setStatesGeoJson();
      this.setUsOutlineConfig();
    });
  }

  private setUsGeoJson(): void {
    this.us = topojson.feature(
      this.map,
      this.map.objects.country
    ) as FeatureCollection<MultiPolygon, MapGeometryProperties>; // topojson types make it not possible for this to be inferred
  }

  private setStatesGeoJson(): void {
    this.states = topojson.feature(
      this.map,
      this.map.objects.states
    ) as FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>; // topojson types make it not possible for this to be inferred
  }

  private setUsOutlineConfig(): void {
    this.usOutlineConfig =
      Vic.geographiesNonAttributeDataLayer<MapGeometryProperties>({
        geographies: this.us.features,
        strokeColor: colors.base,
        strokeWidth: '1',
        categorical: Vic.dimensionCategorical<
          VicGeographiesFeature<MapGeometryProperties, MultiPolygon | Polygon>
        >({
          valueAccessor: (d) => d.properties.name,
          range: ['none'],
        }),
      });
  }
}
