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
    dateFormat = valueFormat.monthYear,
    convertHeadersFromCamelCaseToTitle = true
  ): void {
    if (dateFields.length > 0) {
      data = data.map((element) => {
        dateFields.forEach((field) => {
          element[field] = formatValue(element[field], dateFormat);
        });
        return element;
      });
    }
    if (convertHeadersFromCamelCaseToTitle) {
      data = data.map((element) => {
        const keys = Object.keys(element);
        for (const key of keys) {
          const newKey = this.convertToTitle(key);
          element[newKey] = element[key];
          delete element[key];
        }
        return element;
      });
    }
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, `${name}.csv`);
  }

  convertToTitle(key: string): string {
    /**
     * Will convert:
     * - thisString -> This String
     * - 123String -> 123 String
     * - 123string -> 123 string
     * - string123 -> String 123
     * - thisSTRING -> This STRING
     * - thisSTRiNG -> This STRi NG
     */
    let converted_key =
      key.charAt(0).toUpperCase() +
      key.slice(1).replace(/([a-z])([A-Z])/g, (match, p1, p2) => p1 + ' ' + p2);
    converted_key = converted_key.replace(
      /([a-zA-Z])(\d+)/g,
      (match, p1, p2) => p1 + ' ' + p2
    );
    converted_key = converted_key.replace(
      /(\d+)([a-zA-Z])/g,
      (match, p1, p2) => p1 + ' ' + p2
    );
    return converted_key;
  }
}
