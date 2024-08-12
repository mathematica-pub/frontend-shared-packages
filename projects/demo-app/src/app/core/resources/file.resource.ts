import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse as mdParse } from 'marked';
import { Observable, map } from 'rxjs';
import { parse as yamlParse } from 'yaml';

@Injectable({
  providedIn: 'root',
})
export class FileResource {
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getYamlFile(filePath: string): Observable<any> {
    console.log('filePath', filePath);
    return this.http
      .get(filePath, {
        responseType: 'text',
      })
      .pipe(map((text) => yamlParse(text)));
  }

  getMarkdownFile(filePath: string): Observable<string> {
    return this.http
      .get(filePath, {
        responseType: 'text',
      })
      .pipe(map((text) => mdParse(text)));
  }
}
