import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XyBackgroundComponent } from './xy-background.component';

@NgModule({
  imports: [CommonModule, XyBackgroundComponent],
  exports: [XyBackgroundComponent],
})
export class VicXyBackgroundModule {}
