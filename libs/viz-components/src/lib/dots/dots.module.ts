import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DotsComponent } from './dots.component';

@NgModule({
  declarations: [DotsComponent],
  imports: [CommonModule],
  exports: [DotsComponent],
})
export class VicDotsModule {}
