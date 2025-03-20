import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GetValueByKeyPipe } from 'libs/app-dev-kit/src/lib/core/pipes/get-value-by-key.pipe';

@NgModule({
  imports: [CommonModule, CdkTableModule, MatIconModule, GetValueByKeyPipe],
  exports: [CdkTableModule],
})
export class TableModule {}
