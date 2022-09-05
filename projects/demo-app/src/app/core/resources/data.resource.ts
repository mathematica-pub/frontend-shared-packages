import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topology } from 'topojson-specification';

@Injectable({ providedIn: 'root' })
export class DataResource {
  constructor(private http: HttpClient) {}

  getBasemap(): Observable<Topology> {
    return this.http.get('assets/example-data/usMap.json', {
      responseType: 'json',
    }) as Observable<Topology>;
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
