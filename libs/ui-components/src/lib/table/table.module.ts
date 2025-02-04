import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SingleSortHeaderComponent } from './single-sort-header/single-sort-header.component';
import { TableComponent } from './table.component';

@NgModule({
  declarations: [TableComponent, SingleSortHeaderComponent],
  imports: [CommonModule, CdkTableModule, MatIconModule],
  exports: [TableComponent, CdkTableModule],
})
export class TableModule {}
