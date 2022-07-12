import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarsDemoRoutingModule } from './bars-demo-routing.module';
import { BarsDemoComponent } from './bars-demo.component';


@NgModule({
  declarations: [
    BarsDemoComponent
  ],
  imports: [
    CommonModule,
    BarsDemoRoutingModule
  ]
})
export class BarsDemoModule { }
