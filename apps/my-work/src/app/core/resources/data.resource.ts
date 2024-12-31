import { Injectable } from '@angular/core';
import { AdkAssetResponse, AdkAssetsService } from '@hsi/app-dev-kit';
import { Observable, map } from 'rxjs';
import { UsMapTopology } from '../services/basemap';

@Injectable({ providedIn: 'root' })
export class DataResource {
  constructor(private assets: AdkAssetsService) {}

  getBasemap(): Observable<UsMapTopology> {
    return this.assets
      .getAsset('content/example-data/counties-10m.json', AdkAssetResponse.Json)
      .pipe(map((response) => response as UsMapTopology));
  }
}
