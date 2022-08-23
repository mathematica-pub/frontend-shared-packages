import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VzcChartModule,
  VzcStackedAreaModule,
  VzcXQuantitativeAxisModule,
  VzcXyBackgroundModule,
  VzcXyChartModule,
  VzcYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { SharedModule } from '../shared/shared.module';
import { StackedAreaRoutingModule } from './stacked-area-routing.module';
import { StackedAreaComponent } from './stacked-area.component';

@NgModule({
  declarations: [StackedAreaComponent],
  imports: [
    CommonModule,
    StackedAreaRoutingModule,
    VzcChartModule,
    VzcXyChartModule,
    VzcStackedAreaModule,
    VzcXyBackgroundModule,
    VzcXQuantitativeAxisModule,
    VzcYQuantitativeAxisModule,
    SharedModule,
  ],
})
export class StackedAreaModule {}
