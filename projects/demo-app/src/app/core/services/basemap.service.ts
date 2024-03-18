import { Injectable } from '@angular/core';
import { FeatureCollection, Geometry } from 'geojson';
import { VicNoDataGeographyConfig } from 'projects/viz-components/src/public-api';
import * as topojson from 'topojson-client';
import { colors } from '../constants/colors.constants';
import { DataResource } from '../resources/data.resource';
import { MapGeometryProperties, UsMapTopology } from './basemap';

@Injectable({
  providedIn: 'root',
})
export class BasemapService {
  map: UsMapTopology;
  us: FeatureCollection<Geometry, MapGeometryProperties>;
  states: FeatureCollection<Geometry, MapGeometryProperties>;
  usOutlineConfig: VicNoDataGeographyConfig;

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
    this.us = topojson.feature(this.map, this.map.objects.country);
  }

  private setStatesGeoJson(): void {
    this.states = topojson.feature(this.map, this.map.objects.states);
  }

  private setUsOutlineConfig(): void {
    const outlineGeography = new VicNoDataGeographyConfig();
    outlineGeography.geographies = this.us.features;
    outlineGeography.strokeWidth = '1';
    outlineGeography.strokeColor = colors.base;
    this.usOutlineConfig = outlineGeography;
  }
}
