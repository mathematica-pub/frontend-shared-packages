import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VicXQuantitativeAxisModule } from 'projects/viz-components/src/lib/axes/x-quantitative/x-quantitative-axis.module';
import { VicYQuantitativeAxisModule } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicChartModule } from 'projects/viz-components/src/lib/chart/chart.module';
import { VicLinesModule } from 'projects/viz-components/src/lib/lines/lines.module';
import { VicHtmlTooltipModule } from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.module';
import { VicXyBackgroundModule } from 'projects/viz-components/src/lib/xy-background/xy-background.module';
import { VicXyChartModule } from 'projects/viz-components/src/lib/xy-chart/xy-chart.module';
import { SharedModule } from '../shared/shared.module';
import { LinesRoutingModule } from './lines-example-routing.module';
import { LinesExampleComponent } from './lines-example.component';

@NgModule({
  declarations: [LinesExampleComponent],
  imports: [
    CommonModule,
    LinesRoutingModule,
    VicChartModule,
    VicLinesModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXQuantitativeAxisModule,
    SharedModule,
    VicHtmlTooltipModule,
    MatButtonToggleModule,
  ],
})
export class LinesModule {}
