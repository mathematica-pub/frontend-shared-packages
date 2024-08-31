import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { Observable, from, map, switchMap } from 'rxjs';
import { parse as yamlParse } from 'yaml';

@Injectable({
  providedIn: 'root',
})
export class FileResource {
  // just here so we can use as a type, copied from Analog.js
  private readonly marked: typeof marked;

  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getYamlFile(filePath: string): Observable<any> {
    return this.http
      .get(filePath, {
        responseType: 'text',
      })
      .pipe(map((text) => yamlParse(text)));
  }

  getMarkdownFile(
    filePath: string,
    customMarked?: typeof marked
  ): Observable<string> {
    return this.http
      .get(filePath, {
        responseType: 'text',
      })
      .pipe(
        switchMap((text) => {
          if (customMarked) {
            // If marked has extensions, return will be Promise<string>, else string
            // See https://github.com/markedjs/marked/discussions/3219
            return from(customMarked.parse(text));
          }
          return from(Promise.resolve(marked.parse(text)));
        })
      );
  }

  getCsvFile(filePath: string): Observable<string> {
    return this.http.get(filePath, { responseType: 'text' });
  }

  getJsonFile(filePath: string): Observable<object> {
    return this.http.get(filePath, {
      responseType: 'json',
    });
  }
}
