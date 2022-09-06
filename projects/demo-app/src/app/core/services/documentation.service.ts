import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { parse } from 'marked';
@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  docs: { [name: string]: Observable<string> } = {};
  private http = inject(HttpClient);

  getDocumentation(name: string): Observable<string> {
    if (!this.docs[name]) {
      if (name.startsWith('/documentation')) {
        this.docs[name] = this.getHttpDocumentation(name);
      } else if (name === 'Overview.md') {
        this.docs[name] = this.http
          .get(name, {
            responseType: 'text',
          })
          .pipe(map((text) => parse(text)));
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

  private getHttpDocumentation(input: string): Observable<string> {
    return this.http.get(`assets${input}.html`, { responseType: 'text' });
  }
}
