import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XyChartComponent } from './xy-chart.component';

@NgModule({
  imports: [CommonModule, XyChartComponent],
  exports: [XyChartComponent],
})
export class VicXyChartModule {}
