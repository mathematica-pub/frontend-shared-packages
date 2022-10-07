import { Injectable } from '@angular/core';
import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';
import { timeFormat } from 'd3-time-format';
import { DateFormat } from '../constants/date-formatting.constants';

@Injectable({
  providedIn: 'root',
})
export class ExportDataService {
  saveCSV(
    data: unknown[],
    name: string,
    dateFields: string[] = [],
    dateFormat = DateFormat.day
  ): void {
    if (dateFields.length > 0) {
      data = data.map((element) => {
        dateFields.forEach((field) => {
          element[field] = timeFormat(dateFormat)(element[field]);
        });
        return element;
      });
    }
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, `${name}.csv`);
  }
}
