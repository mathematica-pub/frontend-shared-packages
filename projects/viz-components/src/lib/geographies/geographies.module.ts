import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeographiesComponent } from './geographies.component';

@NgModule({
  declarations: [GeographiesComponent],
  imports: [CommonModule],
  exports: [GeographiesComponent],
})
export class GeographiesModule {}
