import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VicXOrdinalAxisModule } from 'projects/viz-components/src/lib/axes/x-ordinal/x-ordinal-axis.module';
import { VicYQuantitativeAxisModule } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicChartModule } from 'projects/viz-components/src/lib/chart/chart.module';
import { VicStackedBarsModule } from 'projects/viz-components/src/lib/stacked-bars/stacked-bars.module';
import { VicXyBackgroundModule } from 'projects/viz-components/src/lib/xy-background/xy-background.module';
import { VicXyChartModule } from 'projects/viz-components/src/lib/xy-chart/xy-chart.module';
import { SharedModule } from '../shared/shared.module';
import { StackedBarsRoutingModule } from './stacked-bars-example-routing.module';
import { StackedBarsExampleComponent } from './stacked-bars-example.component';

@NgModule({
  declarations: [StackedBarsExampleComponent],
  imports: [
    CommonModule,
    StackedBarsRoutingModule,
    VicChartModule,
    VicStackedBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
    SharedModule,
  ],
})
export class StackedBarsModule {}
