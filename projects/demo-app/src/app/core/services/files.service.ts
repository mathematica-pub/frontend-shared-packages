import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  docs: { [name: string]: Observable<string> } = {};
  code: { [name: string]: Observable<string> } = {}; // this requires all examples to have unique names

  constructor(private http: HttpClient) {}

  getDocumentation(name: string): Observable<string> {
    if (!this.docs[name]) {
      this.docs[name] = this.http.get(`assets${name + '.html'}`, {
        responseType: 'text',
      });
    }
    return this.docs[name];
  }

  getCode(name: string): Observable<string> {
    if (!this.code[name]) {
      this.code[name] = this.http
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
    return this.code[name];
  }
}
