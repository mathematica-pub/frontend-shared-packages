import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { Observable, from, map, switchMap } from 'rxjs';
import { parse as yamlParse } from 'yaml';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  // just here so we can use as a type, copied from Analog.js
  private readonly marked: typeof marked;
  private assets: { [name: string]: Observable<unknown> } = {};

  constructor(private http: HttpClient) {}

  /**
   * Get the asset with the file path..
   *
   * User can provide a generic type to specify the return type of the asset. If not provided, it defaults to unknown.
   *
   * @param filePath The name of the asset to retrieve. This is the path, including the file name, from the assets folder. Should not include a leading slash.
   *
   * @returns The asset as an Observable<T = unknown>.
   */
  getYamlFile<T = unknown>(filePath: string): Observable<T> {
    if (!this.assets[filePath]) {
      this.assets[filePath] = this.http
        .get(`assets/${filePath}`, {
          responseType: 'text',
        })
        .pipe(map((text) => yamlParse(text)));
    }
    return this.assets[filePath] as Observable<T>;
  }

  /**
   * Get the asset with the file path..
   *
   * @param filePath The name of the asset to retrieve. This is the path, including the file name, from the assets folder. Should not include a leading slash.
   *
   * @returns The asset as an Observable<string>.
   */
  getMarkdownFile(
    filePath: string,
    customMarked?: typeof marked
  ): Observable<string> {
    if (!this.assets[filePath]) {
      this.assets[filePath] = this.http
        .get(`assets/${filePath}`, {
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
    return this.assets[filePath] as Observable<string>;
  }

  /**
   * Get the asset with the file path..
   *
   * @param filePath The name of the asset to retrieve. This is the path, including the file name, from the assets folder. Should not include a leading slash.
   *
   * @returns The asset as an Observable<string>.
   */
  getCsvFile(filePath: string): Observable<string> {
    if (!this.assets[filePath]) {
      this.assets[filePath] = this.http.get(`assets/${filePath}`, {
        responseType: 'text',
      });
    }
    return this.assets[filePath] as Observable<string>;
  }

  /**
   * Get the asset with the file path..
   *
   * User can provide a generic type to specify the return type of the asset. If not provided, it defaults to object.
   *
   * @param filePath The name of the asset to retrieve. This is the path, including the file name, from the assets folder. Should not include a leading slash.
   *
   * @returns The asset as an Observable<T = object>.
   */
  getJsonFile<T = object>(filePath: string): Observable<T> {
    if (!this.assets[filePath]) {
      this.assets[filePath] = this.http.get(`assets/${filePath}`, {
        responseType: 'json',
      });
    }
    return this.assets[filePath] as Observable<T>;
  }
}
