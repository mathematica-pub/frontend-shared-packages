import { Injectable } from '@angular/core';
import { AdkAssetResponse, AdkAssetsService } from '@hsi/app-dev-kit';
import { Observable, map } from 'rxjs';
import { UsMapTopology } from '../services/basemap';

@Injectable({ providedIn: 'root' })
export class DataResource {
  constructor(private assets: AdkAssetsService) {}

  getBasemap(): Observable<UsMapTopology> {
    return this.assets
      .getAsset('example-data/usMap.json', AdkAssetResponse.Json)
      .pipe(map((response) => response as UsMapTopology));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMetroUnemploymentData(): Observable<any> {
    return this.assets.getAsset(
      'example-data/metro_unemployment.json',
      AdkAssetResponse.Json
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getIndustryUnemploymentData(): Observable<any> {
    return this.assets.getAsset(
      'example-data/industry_unemployment.json',
      AdkAssetResponse.Json
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStateIncomeData(): Observable<any> {
    return this.assets.getAsset(
      'example-data/state_income.json',
      AdkAssetResponse.Json
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWeatherData(): Observable<any> {
    return this.assets.getAsset(
      'example-data/weather.json',
      AdkAssetResponse.Json
    );
  }
}
