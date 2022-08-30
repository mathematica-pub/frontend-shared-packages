import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IndustryUnemploymentDatum,
  MetroUnemploymentDatum,
} from '../models/unemployement-data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  metroUnemploymentData$: Observable<MetroUnemploymentDatum[]>;
  industryUnemploymentData$: Observable<IndustryUnemploymentDatum[]>;

  constructor(private http: HttpClient) { }

  initData(): void {
    this.setMetroUnemploymentData();
    this.setIndustryUnemploymentData();
  }

  setMetroUnemploymentData(): void {
    this.metroUnemploymentData$ = this.http
      .get('assets/metro_unemployment.json', { responseType: 'json' })
      .pipe(
        map((data) =>
          data['data'].map((datum) => this.metroDatumTransform(datum))
        ),
        shareReplay()
      );
  }

  setIndustryUnemploymentData(): void {
    this.industryUnemploymentData$ = this.http
      .get('assets/industry_unemployment.json', { responseType: 'json' })
      .pipe(
        map((data) =>
          data['data'].map((datum) => this.industryDatumTransform(datum))
        ),
        shareReplay()
      );
  }

  private metroDatumTransform(datum: {
    division: string;
    date: string;
    unemployment: number;
  }): MetroUnemploymentDatum {
    return {
      division: datum.division,
      date: new Date(datum.date),
      value: datum.unemployment,
    };
  }

  private industryDatumTransform(datum: {
    industry: string;
    date: string;
    unemployed: number;
  }): IndustryUnemploymentDatum {
    return {
      industry: datum.industry,
      date: new Date(datum.date),
      value: datum.unemployed,
    };
  }
}
