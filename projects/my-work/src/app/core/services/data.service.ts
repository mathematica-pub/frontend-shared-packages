import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { map, Observable } from 'rxjs';
import { FileResource } from '../resources/file.resource';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private file: FileResource) {}

  getDataFile(filePath: string): Observable<any> {
    const splitFilePath = filePath.split('.');
    const fileExtension = splitFilePath[splitFilePath.length - 1];
    switch (fileExtension) {
      case 'yaml':
        return this.file.getYamlFile(filePath);
      case 'md':
        return this.file.getMarkdownFile(filePath);
      case 'csv':
        return this.file
          .getCsvFile(filePath)
          .pipe(map((text) => csvParse(text)));
      case 'json':
      default:
        return this.file.getJsonFile(filePath);
    }
  }
}
