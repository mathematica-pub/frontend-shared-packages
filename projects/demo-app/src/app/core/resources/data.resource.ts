import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UsMapTopology } from '../services/basemap';

@Injectable({ providedIn: 'root' })
export class DataResource {
  constructor(private http: HttpClient) {}

  getBasemap(): Observable<UsMapTopology> {
    return this.http
      .get('assets/example-data/usMap.json')
      .pipe(map((response) => response as UsMapTopology));
  }

  getMetroUnemploymentData(): Observable<any> {
    return this.http.get('assets/example-data/metro_unemployment.json', {
      responseType: 'json',
    });
  }

  getIndustryUnemploymentData(): Observable<any> {
    return this.http.get('assets/example-data/industry_unemployment.json', {
      responseType: 'json',
    });
  }

  getStateIncomeData(): Observable<any> {
    return this.http.get('assets/example-data/state_income.json', {
      responseType: 'json',
    });
  }
}
