import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VicHtmlTooltipModule } from '../html-tooltip/html-tooltip.module';
import { XyChartComponent } from './xy-chart.component';

@NgModule({
  declarations: [XyChartComponent],
  imports: [CommonModule, VicHtmlTooltipModule],
  exports: [XyChartComponent],
})
export class VicXyChartModule {}
