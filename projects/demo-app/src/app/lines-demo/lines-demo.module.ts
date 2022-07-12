import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinesDemoRoutingModule } from './lines-demo-routing.module';
import { LinesDemoComponent } from './lines-demo.component';


@NgModule({
  declarations: [
    LinesDemoComponent
  ],
  imports: [
    CommonModule,
    LinesDemoRoutingModule
  ]
})
export class LinesDemoModule { }
