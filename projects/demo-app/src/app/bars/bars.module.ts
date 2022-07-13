import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarsRoutingModule } from './bars-routing.module';
import { BarsComponent } from './bars.component';


@NgModule({
  declarations: [
    BarsComponent
  ],
  imports: [
    CommonModule,
    BarsRoutingModule
  ]
})
export class BarsModule { }
