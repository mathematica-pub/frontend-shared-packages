import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StackedAreaComponent } from './stacked-area.component';

const routes: Routes = [{ path: '', component: StackedAreaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StackedAreaRoutingModule {}
