/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AdkAssetResponse, AdkAssetsService } from '@mathstack/app-kit';
import { MapGeometryProperties } from 'apps/demo-app/src/app/core/services/basemap';
import {
  geoMercator,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
  select,
} from 'd3';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { map, Observable } from 'rxjs';
import * as topojson from 'topojson-client';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import {
  mapLegendHeight,
  noDataColor,
} from '../../ca-access/ca-access.constants';
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
  mapLegendHeight = mapLegendHeight;
  labels = [
    { name: 'Geographic Provider Shortage Area', color: mlbColorRange[0] },
    { name: 'Not A Geographic Provider Shortage Area', color: noDataColor },
  ];

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

  getMap(): Observable<FeatureCollection> {
    return this.assets
      .getAsset(`${caDataFolder}HPSA.json`, AdkAssetResponse.Json)
      .pipe(map((response) => response as FeatureCollection));
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
        .attr('fill', noDataColor)
        .attr('stroke', noDataColor);
    });
  }

  drawHPSA(collection: FeatureCollection): void {
    collection.features
      .filter((feature) => {
        return (
          feature.properties['CStNM'] === 'California' &&
          feature.properties['HpsTypDes'] !== 'HPSA Population'
        );
      })
      .forEach((feature) => {
        select(this.container.nativeElement)
          .select('svg')
          .append('path')
          .datum(feature)
          .attr('d', this.pathGenerator)
          .attr('fill', mlbColorRange[0])
          .attr('stroke', mlbColorRange[0])
          .attr('stroke-width', 0.5);
      });
  }
}
