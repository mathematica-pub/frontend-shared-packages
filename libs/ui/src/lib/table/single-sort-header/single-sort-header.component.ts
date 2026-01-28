/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import { TableColumn } from '../table-column';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[hsi-ui-single-sort-header]',
  templateUrl: './single-sort-header.component.html',
  styleUrls: ['./single-sort-header.component.scss'],
  standalone: false,
})
export class SingleSortHeaderComponent<Datum> {
  @Input() column: TableColumn<Datum>;
  @Input() sortIcon: string;

  getColumnSortClasses(): string[] {
    const baseClasses = [
      'material-symbols-outlined',
      this.column.sortDirection,
    ];
    return this.column.activelySorted
      ? baseClasses.concat('actively-sorted')
      : baseClasses;
  }
}
