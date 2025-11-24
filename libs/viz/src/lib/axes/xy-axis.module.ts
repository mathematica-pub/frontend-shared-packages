import { NgModule } from '@angular/core';
import { XOrdinalAxisComponent } from './x-ordinal/x-ordinal-axis.component';
import { XQuantitativeAxisComponent } from './x-quantitative/x-quantitative-axis.component';
import { YOrdinalAxisComponent } from './y-ordinal/y-ordinal-axis.component';
import { YQuantitativeAxisComponent } from './y-quantitative-axis/y-quantitative-axis.component';
@NgModule({
  imports: [
    YQuantitativeAxisComponent,
    YOrdinalAxisComponent,
    XQuantitativeAxisComponent,
    XOrdinalAxisComponent,
  ],
  exports: [
    YQuantitativeAxisComponent,
    YOrdinalAxisComponent,
    XQuantitativeAxisComponent,
    XOrdinalAxisComponent,
  ],
})
export class VicXyAxisModule {}
