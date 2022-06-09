import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizeChartHeightPipe } from './resize-chart-height.pipe';

@NgModule({
  declarations: [ResizeChartHeightPipe],
  imports: [CommonModule],
  exports: [ResizeChartHeightPipe],
})
export class SharedModule {}
