import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupedBarsComponent } from './grouped-bars.component';

@NgModule({
  imports: [CommonModule, GroupedBarsComponent],
  exports: [GroupedBarsComponent],
})
export class VicGroupedBarsModule {}
