import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, CdkTableModule, MatIconModule],
  exports: [CdkTableModule],
})
export class TableModule {}
