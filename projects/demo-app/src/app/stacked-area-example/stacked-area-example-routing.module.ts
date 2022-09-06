import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StackedAreaExampleComponent } from './stacked-area-example.component';

const routes: Routes = [{ path: '', component: StackedAreaExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StackedAreaRoutingModule {}
