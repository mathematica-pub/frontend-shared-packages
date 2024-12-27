import { Injectable } from '@angular/core';
import { GeographiesGeojsonPropertiesLayer } from '@hsi/viz-components';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import * as topojson from 'topojson-client';
import { DataResource } from '../resources/data.resource';
import { MapGeometryProperties, UsMapTopology } from './basemap';

@Injectable({
  providedIn: 'root',
})
export class BasemapService {
  map: UsMapTopology;
  us: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  states: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  counties: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  usOutlineConfig: GeographiesGeojsonPropertiesLayer<
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
      this.setCountiesGeoJson();
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

  private setCountiesGeoJson(): void {
    this.counties = topojson.feature(
      this.map,
      this.map.objects['counties']
    ) as FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>; // topojson types make it not possible for this to be inferred
  }
}
