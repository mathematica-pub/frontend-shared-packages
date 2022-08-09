import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmploymentDatum } from '../models/employement-data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  employmentData$: Observable<EmploymentDatum[]>;

  constructor(private http: HttpClient) {}

  setEmploymentData(): void {
    this.employmentData$ = this.http
      .get('assets/metro_unemployment.json', { responseType: 'json' })
      .pipe(
        map((data) =>
          data['data'].map((datum) => this.employmentDatumTransform(datum))
        ),
        shareReplay()
      );
  }

  private employmentDatumTransform(datum: {
    division: string;
    date: string;
    unemployment: number;
  }): EmploymentDatum {
    return {
      division: datum.division,
      date: new Date(datum.date),
      value: datum.unemployment,
    };
  }
}
