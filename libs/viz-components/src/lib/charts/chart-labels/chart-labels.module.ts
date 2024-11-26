import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartTitleComponent } from './chart-title/chart-title.component';
import { XAxisLabelComponent } from './x-axis-label/x-axis-label.component';
import { YAxisLabelComponent } from './y-axis-label/y-axis-label.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChartTitleComponent,
    XAxisLabelComponent,
    YAxisLabelComponent,
  ],
  exports: [ChartTitleComponent, XAxisLabelComponent, YAxisLabelComponent],
})
export class VicChartLabelsModule {}
