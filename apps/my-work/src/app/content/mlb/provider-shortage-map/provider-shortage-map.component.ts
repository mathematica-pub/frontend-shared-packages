/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AdkAssetResponse, AdkAssetsService } from '@hsi/app-dev-kit';
import { MapGeometryProperties } from 'apps/demo-app/src/app/core/services/basemap';
import {
  geoMercator,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
  select,
} from 'd3';
import {
  FeatureCollection,
  Geometry,
  GeometryCollection,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { map, Observable } from 'rxjs';
import * as topojson from 'topojson-client';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import { caDataFolder } from '../../ca/data-paths.constants';
import { CaMapTopology } from '../mlb-map/mlb-map.component';
import { mlbColorRange } from '../mlb.constants';

@Component({
  selector: 'app-provider-shortage-map',
  standalone: true,
  imports: [CommonModule, ExportContentComponent],
  templateUrl: 'provider-shortage-map.component.html',
  styleUrl: './provider-shortage-map.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProviderShortageMapComponent implements OnInit {
  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement>;
  countyMap: CaMapTopology;
  counties: FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  projection: GeoProjection;
  pathGenerator: GeoPath<any, GeoPermissibleObjects>;
  width = 550;
  height = 650;

  constructor(private assets: AdkAssetsService) {}

  ngOnInit() {
    this.createSVG();
    this.setProjection();
    this.setMapObjects();
  }

  createSVG() {
    select(this.container.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  setProjection() {
    this.projection = geoMercator()
      .scale(3000)
      .center([-119.3, 37.5]) // Centered on California
      .translate([this.width / 2, this.height / 2]);

    this.pathGenerator = geoPath().projection(this.projection);
  }

  setMapObjects(): void {
    this.getCountyMap().subscribe((map) => {
      this.countyMap = map;
      this.setCountiesGeoJson();
      this.drawCounties();
    });
    this.getMap().subscribe((map) => {
      this.drawHPSA(map);
    });
  }

  getCountyMap(): Observable<CaMapTopology> {
    return this.assets
      .getAsset(`${caDataFolder}caCountiesTopo.json`, AdkAssetResponse.Json)
      .pipe(map((response) => response as CaMapTopology));
  }

  getMap(): Observable<GeometryCollection> {
    return this.assets
      .getAsset(`${caDataFolder}HPSA.json`, AdkAssetResponse.Json)
      .pipe(map((response) => response as GeometryCollection));
  }

  setCountiesGeoJson(): void {
    this.counties = topojson.feature(
      this.countyMap,
      this.countyMap.objects['subunits']
    ) as FeatureCollection<MultiPolygon | Polygon, MapGeometryProperties>;
  }

  drawCounties(): void {
    this.counties.features.forEach((feature) => {
      select(this.container.nativeElement)
        .select('svg')
        .append('path')
        .datum(feature)
        .attr('d', this.pathGenerator)
        .attr('fill', mlbColorRange[0])
        .attr('stroke', mlbColorRange[0]);
    });
  }

  drawHPSA(collection: GeometryCollection<Geometry>): void {
    collection.geometries.forEach((geometry) => {
      select(this.container.nativeElement)
        .select('svg')
        .append('path')
        .datum(geometry)
        .attr('d', this.pathGenerator)
        .attr('fill', mlbColorRange[2])
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5);
    });
  }
}
