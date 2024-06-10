import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VicXQuantitativeAxisModule } from 'projects/viz-components/src/lib/axes/x-quantitative/x-quantitative-axis.module';
import { VicYQuantitativeAxisModule } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicChartModule } from 'projects/viz-components/src/lib/chart/chart.module';
import { VicStackedAreaModule } from 'projects/viz-components/src/lib/stacked-area/stacked-area.module';
import { VicHtmlTooltipModule } from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.module';
import { VicXyBackgroundModule } from 'projects/viz-components/src/lib/xy-background/xy-background.module';
import { VicXyChartModule } from 'projects/viz-components/src/lib/xy-chart/xy-chart.module';
import { SharedModule } from '../shared/shared.module';
import { StackedAreaRoutingModule } from './stacked-area-example-routing.module';
import { StackedAreaExampleComponent } from './stacked-area-example.component';

@NgModule({
  declarations: [StackedAreaExampleComponent],
  imports: [
    CommonModule,
    StackedAreaRoutingModule,
    VicChartModule,
    VicXyChartModule,
    VicHtmlTooltipModule,
    VicStackedAreaModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
    SharedModule,
  ],
})
export class StackedAreaModule {}
