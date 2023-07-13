import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import { formatValue } from '../value-format/value-format';
import { DataExportConfig } from './data-export.config';

@Injectable()
export class VicExportDataService {
  saveCSV(name: string, dataConfigs: DataExportConfig[]): void {
    const blobParts = [];
    for (const dataConfig of dataConfigs) {
      if (dataConfig.dateFields.length > 0) {
        dataConfig.data = dataConfig.data.map((element) => {
          dataConfig.dateFields.forEach((field) => {
            element[field] = formatValue(element[field], dataConfig.dateFormat);
          });
          return element;
        });
      }
      if (dataConfig.convertHeadersFromCamelCaseToTitle) {
        dataConfig.data = dataConfig.data.map((element) => {
          const keys = Object.keys(element);
          for (const key of keys) {
            const newKey = this.convertToTitle(key);
            element[newKey] = element[key];
            delete element[key];
          }
          return element;
        });
      }

      let csv: string;

      if (dataConfig.flipped) {
        const data: any = dataConfig.data.reduce((acc: any, curr: any) => {
          for (const key in curr) {
            if (
              dataConfig.flippedHeaderKey &&
              key === dataConfig.flippedHeaderKey
            )
              continue;

            const valueToAdd =
              curr[key] instanceof String || typeof curr[key] === 'string'
                ? `"${curr[key]}"`
                : curr[key];
            if (key in acc) {
              acc[key] += `,${valueToAdd}`;
            } else {
              acc[key] = `${valueToAdd}`;
            }
          }
          return acc;
        }, {});

        csv = '';
        if (dataConfig.flippedHeaderKey) {
          csv += ',';
          csv += dataConfig.data.reduce((acc: any, curr: any) => {
            if (acc !== '') {
              acc += `,${curr[dataConfig.flippedHeaderKey]}`;
            } else {
              acc += `${curr[dataConfig.flippedHeaderKey]}`;
            }
            return acc;
          }, '');
        }

        for (const key of Object.keys(data)) {
          if (csv !== '') {
            csv += '\r\n';
          }
          csv += `${key},${data[key]}`;
        }
      } else {
        csv = unparse(dataConfig.data);
      }

      for (let i = 0; i < dataConfig.marginBottom; i++) {
        csv = `${csv}\r\n`;
      }
      blobParts.push(csv);
    }
    const blob = new Blob(blobParts, { type: 'text/csv;charset=utf-8' });
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
