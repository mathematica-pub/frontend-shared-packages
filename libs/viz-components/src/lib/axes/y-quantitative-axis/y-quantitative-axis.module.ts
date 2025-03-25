import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YQuantitativeAxisComponent } from './y-quantitative-axis.component';

@NgModule({
  imports: [CommonModule, YQuantitativeAxisComponent],
  exports: [YQuantitativeAxisComponent],
})
export class VicYQuantitativeAxisModule {}
