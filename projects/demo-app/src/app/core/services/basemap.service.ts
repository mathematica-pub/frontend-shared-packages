import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { NoDataGeographyConfig } from 'projects/viz-components/src/public-api';
import { Observable, shareReplay } from 'rxjs';
import * as topojson from 'topojson-client';
import { Topology } from 'topojson-specification';
import { colors } from '../constants/colors.constants';
import { DataResource } from '../resources/data.resource';

@Injectable({
  providedIn: 'root',
})
export class BasemapService {
  map$: Observable<Topology>;
  us: FeatureCollection;
  states: FeatureCollection;
  usOutlineConfig: NoDataGeographyConfig;

  constructor(private data: DataResource) {}

  initMap(): void {
    this.setMapObjects();
  }

  setMapObjects(): void {
    this.map$ = this.data.getBasemap().pipe(shareReplay());
    this.map$.subscribe((map) => {
      this.setUsGeoJson(map);
      this.setStatesGeoJson(map);
      this.setUsOutlineConfig();
    });
  }

  private setUsGeoJson(map: Topology): void {
    this.us = topojson.feature(
      map,
      map.objects['country']
    ) as FeatureCollection;
  }

  private setStatesGeoJson(map: Topology): void {
    this.states = topojson.feature(
      map,
      map.objects['states']
    ) as FeatureCollection;
  }

  private setUsOutlineConfig(): void {
    const outlineGeography = new NoDataGeographyConfig();
    outlineGeography.geographies = this.us.features;
    outlineGeography.strokeWidth = '1';
    outlineGeography.strokeColor = colors.base;
    this.usOutlineConfig = outlineGeography;
  }
}
