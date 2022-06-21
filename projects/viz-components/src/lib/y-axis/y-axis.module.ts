import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YAxisComponent } from './y-axis.component';

// QUESTION: why does each component have its own module?
@NgModule({
  declarations: [YAxisComponent],
  imports: [CommonModule],
  exports: [YAxisComponent],
})
export class VzcYAxisModule {}
