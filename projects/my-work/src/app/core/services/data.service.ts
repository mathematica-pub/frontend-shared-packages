import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { map, Observable, of } from 'rxjs';
import { FileResource } from '../resources/file.resource';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private file: FileResource) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataFile(filePath: string): Observable<any> {
    const splitFilePath = filePath.split('.');
    const fileExtension = splitFilePath[splitFilePath.length - 1];
    switch (fileExtension) {
      case 'csv':
        return this.file
          .getCsvFile(filePath)
          .pipe(map((text) => csvParse(text)));
      case 'json':
        return this.file.getJsonFile(filePath);
      default:
        console.error(
          'File type not supported. Please provide a path with a file extension of .csv or .json'
        );
        return of(null);
    }
  }
}
