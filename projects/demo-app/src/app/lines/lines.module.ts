import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VzcChartModule,
  VzcLinesModule,
  VzcXQuantitativeAxisModule,
  VzcXyChartBackgroundModule,
  VzcXyChartModule,
  VzcYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { SharedModule } from '../shared/shared.module';
import { LinesRoutingModule } from './lines-routing.module';

import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [LinesComponent],
  imports: [
    CommonModule,
    LinesRoutingModule,
    VzcChartModule,
    VzcLinesModule,
    VzcXyChartModule,
    VzcXyChartBackgroundModule,
    VzcYQuantitativeAxisModule,
    VzcXQuantitativeAxisModule,
    SharedModule,
  ],
})
export class LinesModule {}
