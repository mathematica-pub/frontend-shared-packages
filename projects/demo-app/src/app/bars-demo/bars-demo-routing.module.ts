import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarsDemoComponent } from './bars-demo.component';

const routes: Routes = [{ path: '', component: BarsDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarsDemoRoutingModule { }
