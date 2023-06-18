import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VicHtmlTooltipModule } from '../tooltips/html-tooltip/html-tooltip.module';
import { ChartComponent } from './chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule, SharedModule, VicHtmlTooltipModule],
  exports: [ChartComponent],
})
export class VicChartModule {}
