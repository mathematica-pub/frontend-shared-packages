import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VzcChartModule,
  VzcLinesModule,
  VzcXOrdinalAxisModule,
  VzcXyChartSpaceModule,
  VzcYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';

import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [LinesComponent],
  imports: [
    CommonModule,
    VzcChartModule,
    VzcLinesModule,
    VzcXyChartSpaceModule,
    VzcXOrdinalAxisModule,
    VzcYOrdinalAxisModule,
  ],
})
export class LinesModule {}
