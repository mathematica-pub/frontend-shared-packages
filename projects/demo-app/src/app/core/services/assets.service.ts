import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse as mdParse } from 'marked';
import { Observable, map } from 'rxjs';
import { parse as yamlParse } from 'yaml';

/**
 * This service is used to retrieve files from the assets folder.
 *
 * Once a file is retrieved, it is stored in a dictionary to prevent duplicate requests.
 */
@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  assets: { [name: string]: Observable<unknown> } = {};

  constructor(private http: HttpClient) {}

  /**
   * Get the asset with the given name.
   *
   * User can provide a generic type to specify the return type of the asset. If not provided, it defaults to string.
   *
   * @param name The name of the asset to retrieve. This is the path, including the file name, from the assets folder. Should not include a leading slash.
   */
  getAsset<T = string>(
    name: string,
    parser: 'yaml' | 'md' | 'none' = 'none'
  ): Observable<T> {
    if (!this.assets[name]) {
      this.assets[name] = this.http
        .get(`assets/${name}`, {
          responseType: 'text',
        })
        .pipe(
          map((text) => {
            switch (parser) {
              case 'yaml':
                return yamlParse(text);
              case 'md':
                return mdParse(text) as string;
              case 'none':
              default:
                return text;
            }
          })
        );
    }
    return this.assets[name] as Observable<T>;
  }
}
