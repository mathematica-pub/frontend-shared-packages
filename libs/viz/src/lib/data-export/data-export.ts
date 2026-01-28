import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash-es';
import { unparse } from 'papaparse';
import { VicDataExportConfig } from './data-export-config';

@Injectable({ providedIn: 'root' })
export class VicDataExport {
  saveCSV(name: string, dataConfigs: VicDataExportConfig[]): void {
    const blobParts = [];
    for (const dataConfig of dataConfigs) {
      let csv: string;

      let csvData = cloneDeep(dataConfig.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      csvData = csvData.map((datum: any) => {
        const returnObj = {};
        for (const column of dataConfig.columns) {
          returnObj[column.title] = column.valueAccessor(datum);
          // handle common unicode character replacements
          // d3 format's strange default minus character https://observablehq.com/@d3/d3-format
          if (typeof returnObj[column.title] === 'string') {
            returnObj[column.title] = returnObj[column.title].replace(
              /\u2212/g,
              '-'
            );
          }
        }
        return returnObj;
      });

      if (dataConfig.flipped) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = csvData.reduce((acc: any, curr: any) => {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          csv += csvData.reduce((acc: any, curr: any) => {
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
        csv = unparse(csvData);
      }

      for (let i = 0; i < dataConfig.marginBottom; i++) {
        csv = `${csv}\r\n`;
      }
      blobParts.push(csv);
    }
    const blob = new Blob(blobParts, { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, `${name}.csv`);
  }
}
