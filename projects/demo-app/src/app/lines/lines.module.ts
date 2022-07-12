import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinesRoutingModule } from './lines-routing.module';
import { LinesComponent } from './lines.component';


@NgModule({
  declarations: [
    LinesComponent
  ],
  imports: [
    CommonModule,
    LinesRoutingModule
  ]
})
export class LinesModule { }
