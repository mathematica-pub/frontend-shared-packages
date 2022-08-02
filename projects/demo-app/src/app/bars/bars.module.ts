import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  VzcBarsModule,
  VzcChartModule,
  VzcXQuantitativeAxisModule,
  VzcXyChartBackgroundModule,
  VzcXyChartSpaceModule,
  VzcYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
import { BarsComponent } from './bars.component';

@NgModule({
  declarations: [BarsComponent],
  imports: [
    CommonModule,
    VzcBarsModule,
    VzcXQuantitativeAxisModule,
    VzcYOrdinalAxisModule,
    VzcChartModule,
    VzcXyChartBackgroundModule,
    VzcXyChartSpaceModule,
  ],
})
export class BarsModule {}
