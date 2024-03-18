import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StackedBarsExampleComponent } from './stacked-bars-example.component';

const routes: Routes = [{ path: '', component: StackedBarsExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StackedBarsRoutingModule {}
