import { Injectable } from '@angular/core';
import { AdkAssetResponse, AdkAssetsService } from '@mathstack/app-kit';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private assets: AdkAssetsService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataFile(filePath: string): Observable<any> {
    const splitFilePath = filePath.split('.');
    const fileExtension = splitFilePath[splitFilePath.length - 1];
    switch (fileExtension) {
      case 'csv':
        return this.assets
          .getAsset(filePath, AdkAssetResponse.Text)
          .pipe(map((text) => this.assets.parseCsv(text as string)));
      case 'json':
        return this.assets.getAsset(filePath, AdkAssetResponse.Json);
      default:
        console.error(
          'File type not supported. Please provide a path with a file extension of .csv or .json'
        );
        return of(null);
    }
  }
}
