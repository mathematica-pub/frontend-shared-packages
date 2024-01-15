import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VicChartModule,
  VicStackedBarsModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
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
    VicYOrdinalAxisModule,
    VicXQuantitativeAxisModule,
    SharedModule,
  ],
})
export class StackedBarsModule {}
