import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XyChartComponent } from './xy-chart.component';

@NgModule({
  declarations: [XyChartComponent],
  imports: [CommonModule],
  exports: [XyChartComponent],
})
export class VicXyChartModule {}
