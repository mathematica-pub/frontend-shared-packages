import { Injectable } from '@angular/core';
import { AdkAssetResponse, AdkAssetsService } from '@hsi/app-dev-kit';
import { Observable, map } from 'rxjs';
import { UsCountyTopology, UsMapTopology } from '../services/basemap';

@Injectable({ providedIn: 'root' })
export class DataResource {
  constructor(private assets: AdkAssetsService) {}

  getBasemap(): Observable<UsMapTopology> {
    return this.assets
      .getAsset('content/example-data/usMap.json', AdkAssetResponse.Json)
      .pipe(map((response) => response as UsMapTopology));
  }

  getCounties(): Observable<UsCountyTopology> {
    return this.assets
      .getAsset(
        'content/example-data/counties-albers-10m.json',
        AdkAssetResponse.Json
      )
      .pipe(map((response) => response as UsCountyTopology));
  }
}
