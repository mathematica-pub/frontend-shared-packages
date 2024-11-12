import { TableColumn } from './table-column';

export class HsiUiTableConfig<Datum> {
  data: Datum[];
  columns: TableColumn<Datum>[];
}
