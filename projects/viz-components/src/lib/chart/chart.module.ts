import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizeChartHeightPipe } from '../core/pipes/resize-chart-height.pipe';
import { ChartComponent } from './chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule, ResizeChartHeightPipe],
  exports: [ChartComponent],
})
export class VicChartModule {}
