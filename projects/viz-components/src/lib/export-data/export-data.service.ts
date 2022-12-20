import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import { formatValue, valueFormat } from '../value-format/value-format';

@Injectable()
export class VicExportDataService {
  saveCSV(
    data: unknown[],
    name: string,
    dateFields: string[] = [],
    dateFormat = valueFormat.monthYear
  ): void {
    if (dateFields.length > 0) {
      data = data.map((element) => {
        dateFields.forEach((field) => {
          element[field] = formatValue(element[field], dateFormat);
        });
        return element;
      });
    }
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, `${name}.csv`);
  }
}
