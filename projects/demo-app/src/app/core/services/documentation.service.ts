import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Documentation, DocumentationType } from '../enums/documentation.enums';

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  docs: { [name: string]: Observable<string> } = {};

  constructor(private http: HttpClient) {}

  getDocumentation(name: string): Observable<string> {
    if (!this.docs[name]) {
      this.docs[name] = this.getHttp(name);
    }
    return this.docs[name];
  }

  private getHttp(input: string): Observable<string> {
    return this.http.get(`assets${input}.html`, { responseType: 'text' });
  }
}
