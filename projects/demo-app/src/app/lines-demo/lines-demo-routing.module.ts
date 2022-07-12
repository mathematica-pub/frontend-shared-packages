import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinesDemoComponent } from './lines-demo.component';

const routes: Routes = [{ path: '', component: LinesDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinesDemoRoutingModule { }
