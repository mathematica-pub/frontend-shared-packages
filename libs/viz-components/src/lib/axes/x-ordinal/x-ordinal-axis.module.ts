import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XOrdinalAxisComponent } from './x-ordinal-axis.component';

@NgModule({
  imports: [CommonModule, XOrdinalAxisComponent],
  exports: [XOrdinalAxisComponent],
})
export class VicXOrdinalAxisModule {}
