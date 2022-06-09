import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MChartsHtmlTooltipModule } from '../html-tooltip/html-tooltip.module';
import { SharedModule } from '../shared/shared.module';
import { ChartComponent } from './chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule, SharedModule, MChartsHtmlTooltipModule],
  exports: [ChartComponent],
})
export class MChartsChartModule {}
