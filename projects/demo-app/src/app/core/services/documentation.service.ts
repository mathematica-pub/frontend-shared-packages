import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'marked';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  docs: { [name: string]: Observable<string> } = {};

  constructor(private http: HttpClient) {}

  getOverview(): Observable<string> {
    return this.http
      .get('OVERVIEW.md', {
        responseType: 'text',
      })
      .pipe(map((text) => parse(text)));
  }

  getDocumentation(name: string): Observable<string> {
    if (!this.docs[name]) {
      if (name.startsWith('/documentation')) {
        this.docs[name] = this.getFileText(name + '.html');
      } else {
        this.docs[name] = this.http
          .get(name, {
            responseType: 'text',
          })
          .pipe(
            map((text) => {
              let selectedClass = 'language-typescript';
              if (name.endsWith('html')) {
                selectedClass = 'language-markup';
                text = '<script type="prism-html-markup">' + text + '</script>';
              } else if (name.endsWith('scss')) selectedClass = 'language-scss';
              return (
                `<pre class="line-numbers"><code class="${selectedClass}">` +
                text +
                '</code></pre>'
              );
            })
          );
      }
    }
    return this.docs[name];
  }

  private getFileText(input: string): Observable<string> {
    return this.http.get(`assets${input}`, {
      responseType: 'text',
    });
  }
}
