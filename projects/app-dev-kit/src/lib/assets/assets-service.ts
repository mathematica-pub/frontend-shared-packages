import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { Observable, forkJoin } from 'rxjs';
import { parse as yamlParse } from 'yaml';
import { AdkAssetsResource } from './assets-resource';

export enum AdkAssetResponse {
  ArrayBuffer = 'arraybuffer',
  Blob = 'blob',
  Json = 'json',
  Text = 'text',
}

@Injectable({ providedIn: 'root' })
export class AdkAssetsService {
  private assets: { [key: string]: Observable<unknown> } = {};
  private assetsPath = 'assets/';

  constructor(private resource: AdkAssetsResource) {}

  setAssetsPath(path: string): void {
    this.assetsPath = path;
  }

  /**
   * Loads an asset from the assets folder.
   *
   * @param assetName The path to the asset from assets/. Should not include leading slash.
   * @returns An observable that emits the asset data.
   */
  getAsset(
    assetName: string,
    responseType: AdkAssetResponse
  ): Observable<unknown> {
    if (!this.assets[assetName]) {
      this.assets[assetName] = this.fetchAsset(assetName, responseType);
    }
    return this.assets[assetName];
  }

  private fetchAsset(
    assetName: string,
    responseType: AdkAssetResponse
  ): Observable<unknown> {
    return this.resource.getAsset(
      `${this.assetsPath}${assetName}`,
      responseType
    );
  }

  /**
   * Loads multiple assets concurrently.
   *
   * @param assetNames An array of asset names to load.
   * @returns An observable that emits an array of asset data.
   */
  getAssets(
    assetNames: string[],
    responseType: AdkAssetResponse
  ): Observable<unknown[]> {
    return forkJoin(
      assetNames.map((assetName) => this.getAsset(assetName, responseType))
    );
  }

  parseCsv<T>(str: string): T[] {
    return csvParse(str) as unknown as T[];
  }

  parseYaml<T>(str: string): T {
    return yamlParse(str) as T;
  }
}
