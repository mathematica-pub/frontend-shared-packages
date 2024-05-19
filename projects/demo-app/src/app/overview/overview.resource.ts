import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'marked';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverviewResource {
  constructor(private http: HttpClient) {}

  getOverviewHtml(): Observable<string> {
    return this.http
      .get('OVERVIEW.md', {
        responseType: 'text',
      })
      .pipe(map((text) => parse(text)));
  }
}
