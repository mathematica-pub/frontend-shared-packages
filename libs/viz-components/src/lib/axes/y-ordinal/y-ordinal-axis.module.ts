import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YOrdinalAxisComponent } from './y-ordinal-axis.component';

@NgModule({
  imports: [CommonModule, YOrdinalAxisComponent],
  exports: [YOrdinalAxisComponent],
})
export class VicYOrdinalAxisModule {}
