import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VzcHtmlTooltipModule } from '../html-tooltip/html-tooltip.module';
import { XyChartComponent } from './xy-chart.component';

@NgModule({
  declarations: [XyChartComponent],
  imports: [CommonModule, VzcHtmlTooltipModule],
  exports: [XyChartComponent],
})
export class VzcXyChartModule {}
