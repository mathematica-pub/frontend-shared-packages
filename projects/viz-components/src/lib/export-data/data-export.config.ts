import { valueFormat } from '../value-format/value-format';

export class DataExportConfig {
  data: unknown[];
  flipped = false;
  flippedHeaderKey: string;
  dateFields: string[] = [];
  dateFormat = valueFormat.monthYear;
  convertHeadersFromCamelCaseToTitle = true;
  marginBottom = 0;
  constructor(config: Partial<DataExportConfig>) {
    Object.assign(this, config);
  }
}
