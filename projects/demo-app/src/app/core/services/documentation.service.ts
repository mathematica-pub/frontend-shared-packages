import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { parse } from 'marked';
@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  docs: { [name: string]: Observable<string> } = {};

  constructor(private http: HttpClient) {}

  getDocumentation(name: string): Observable<string> {
    if (!this.docs[name]) {
      if (name.startsWith('/documentation')) {
        this.docs[name] = this.getHttpDocumentation(name);
      } else if (name === '/overview') {
        this.docs[name] = this.http
          .get('Overview.md', {
            responseType: 'text',
          })
          .pipe(map((text) => parse(text)));
      }
    }
    return this.docs[name];
  }

  private getHttpDocumentation(input: string): Observable<string> {
    return this.http.get(`assets${input}.html`, { responseType: 'text' });
  }
}
