import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import {
  IndustryUnemploymentDatum,
  MetroUnemploymentDatum,
  StateIncomeDatum,
} from '../models/data';
import { DataResource } from '../resources/data.resource';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  metroUnemploymentData$: Observable<MetroUnemploymentDatum[]>;
  industryUnemploymentData$: Observable<IndustryUnemploymentDatum[]>;
  stateIncomeData$: Observable<StateIncomeDatum[]>;

  constructor(private data: DataResource) {}

  initData(): void {
    this.setMetroUnemploymentData();
    this.setIndustryUnemploymentData();
    this.setStateIncomeData();
  }

  setMetroUnemploymentData(): void {
    this.metroUnemploymentData$ = this.data.getMetroUnemploymentData().pipe(
      map((data) =>
        data['data'].map((datum) => this.metroDatumTransform(datum))
      ),
      shareReplay()
    );
  }

  setIndustryUnemploymentData(): void {
    this.industryUnemploymentData$ = this.data
      .getIndustryUnemploymentData()
      .pipe(
        map((data) =>
          data['data'].map((datum) => this.industryDatumTransform(datum))
        ),
        shareReplay()
      );
  }

  setStateIncomeData(): void {
    this.stateIncomeData$ = this.data.getStateIncomeData().pipe(
      map((data) => {
        return data as StateIncomeDatum[];
      }),
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
