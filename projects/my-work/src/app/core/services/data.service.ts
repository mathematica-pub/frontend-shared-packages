import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataResource } from '../resources/data.resource';

@Injectable()
export class DataService<Datum> {
  data$: Observable<Datum[]>;

  constructor(private data: DataResource) {}

  initJsonData(path: string): void {
    this.data$ = this.data.getJson(path);
  }
}
