import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  VicChartModule,
  VicHtmlTooltipModule,
  VicLinesModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
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
