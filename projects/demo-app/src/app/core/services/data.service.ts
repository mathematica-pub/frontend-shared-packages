import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmploymentDatum } from '../models/employement-data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getEmploymentData(): Observable<EmploymentDatum[]> {
    return this.http
      .get('assets/metro_unemployment.json', { responseType: 'json' })
      .pipe(
        map((data) =>
          data['data'].map((datum) => this.employmentDatumTransform(datum))
        ),
        shareReplay()
      );
  }

  employmentDatumTransform(datum: {
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
