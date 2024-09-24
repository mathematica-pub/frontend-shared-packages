import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdkAssetResponse } from './assets-service';

@Injectable({
  providedIn: 'root',
})
export class AdkAssetsResource {
  constructor(private http: HttpClient) {}

  getAsset(path: string, responseType: AdkAssetResponse): Observable<unknown> {
    return this.http.get<unknown>(path, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseType: responseType as any,
    });
  }
}
