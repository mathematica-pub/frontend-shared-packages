import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataResource {
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getJson(path: string): Observable<any> {
    return this.http.get(path, {
      responseType: 'json',
    });
  }

  getCsv(path: string): Observable<any> {
    return this.http.get(path, {
      responseType: 'text',
    });
  }
}
