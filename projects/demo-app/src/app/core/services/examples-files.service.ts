import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamplesFilesService {
  files: { [name: string]: Observable<string> } = {}; // this requires all examples to have unique names

  constructor(private http: HttpClient) {}

  getComponentCode(name: string): Observable<string> {
    if (!this.files[name]) {
      this.files[name] = this.http
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
    return this.files[name];
  }
}
