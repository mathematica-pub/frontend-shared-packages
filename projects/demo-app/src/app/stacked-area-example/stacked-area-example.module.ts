import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VicChartModule,
  VicHtmlTooltipModule,
  VicStackedAreaModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
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
