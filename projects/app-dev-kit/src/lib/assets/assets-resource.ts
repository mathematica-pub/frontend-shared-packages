import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdkAssetResponseType } from './assets-service';

@Injectable({
  providedIn: 'root',
})
export class AdkAssetsResource {
  constructor(private http: HttpClient) {}

  getAsset(
    path: string,
    responseType: AdkAssetResponseType
  ): Observable<unknown> {
    return this.http.get<unknown>(path, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseType: responseType as any,
    });
  }
}
