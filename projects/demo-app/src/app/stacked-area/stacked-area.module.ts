import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VicChartModule,
  VicStackedAreaModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { SharedModule } from '../shared/shared.module';
import { StackedAreaRoutingModule } from './stacked-area-routing.module';
import { StackedAreaComponent } from './stacked-area.component';

@NgModule({
  declarations: [StackedAreaComponent],
  imports: [
    CommonModule,
    StackedAreaRoutingModule,
    VicChartModule,
    VicXyChartModule,
    VicStackedAreaModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
    SharedModule,
  ],
})
export class StackedAreaModule {}
