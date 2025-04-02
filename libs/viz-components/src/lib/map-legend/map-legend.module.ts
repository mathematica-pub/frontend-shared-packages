import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContinuousLegendComponent } from './continuous-legend/continuous-legend.component';
import { DiscontinuousLegendComponent } from './discontinuous-legend/discontinuous-legend.component';
import { MapLegendComponent } from './map-legend.component';

@NgModule({
  imports: [
    CommonModule,
    MapLegendComponent,
    DiscontinuousLegendComponent,
    ContinuousLegendComponent,
  ],
  exports: [MapLegendComponent],
})
export class VicMapLegendModule {}
