import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VzcHtmlTooltipModule } from '../html-tooltip/html-tooltip.module';
import { SharedModule } from '../shared/shared.module';
import { ChartComponent } from './chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule, SharedModule, VzcHtmlTooltipModule],
  exports: [ChartComponent],
})
export class VzcChartModule {}
