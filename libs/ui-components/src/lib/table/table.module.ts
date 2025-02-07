import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SingleSortHeaderComponent } from './single-sort-header/single-sort-header.component';

@NgModule({
  declarations: [SingleSortHeaderComponent],
  imports: [CommonModule, CdkTableModule, MatIconModule],
  exports: [CdkTableModule, SingleSortHeaderComponent],
})
export class TableModule {}
